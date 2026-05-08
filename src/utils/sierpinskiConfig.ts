import { parse } from "yaml";
import { HexagonConfig, HexSection, HEX_SECTION_ORDER, minConfig } from "../components/SierpinskiHexagon";
import { getSierpinskiYamlSource } from "../config/sierpinski/registry.generated";
import { performTransitionAndRedirect } from "./sierpinskiTransition";

type HexView = "app" | "page";

type SectionValueMap<T> = Partial<Record<HexSection, T>> & Partial<Record<`${1 | 2 | 3 | 4 | 5 | 6}`, T>>;

interface ActionSpec {
  type: "navigate" | "transition" | "external" | "reload" | "alert" | "noop";
  to?: string;
  url?: string;
  message?: string;
  newTab?: boolean;
}

interface ConfigRef {
  pageId: string;
  view?: HexView;
  overrides?: HexConfigInput;
}

interface PageRefEntry {
  file: string;
}

type PageTree = {
  [key: string]: PageTree | PageEntry | PageRefEntry;
};

interface HexConfigInput extends Partial<Omit<HexagonConfig, "targetLevels" | "text" | "config" | "actions" | "backButton" | "confusedButton">> {
  extends?: string[];
  targetLevels?: SectionValueMap<number>;
  text?: SectionValueMap<string>;
  backButton?: Partial<HexagonConfig["backButton"]>;
  confusedButton?: Partial<NonNullable<HexagonConfig["confusedButton"]>>;
  actions?: Partial<Record<HexSection | "default", ActionSpec>>;
  configRefs?: Partial<Record<HexSection, ConfigRef>>;
}

interface PageEntry extends HexConfigInput {
  shared?: HexConfigInput;
  app?: HexConfigInput;
  page?: HexConfigInput;
}

interface HomeRoot {
  presetsFile?: string;
  presets?: Record<string, HexConfigInput>;
  pages: PageTree;
}

let homeConfigPromise: Promise<HomeRoot> | null = null;
const yamlDocumentCache = new Map<string, unknown>();

function normalizeSectionKey(sectionKey: string): HexSection | null {
  if ((HEX_SECTION_ORDER as string[]).includes(sectionKey)) {
    return sectionKey as HexSection;
  }

  const numericSection = Number(sectionKey);
  if (Number.isInteger(numericSection) && numericSection >= 1 && numericSection <= 6) {
    return HEX_SECTION_ORDER[numericSection - 1];
  }

  return null;
}

function normalizeTargetLevels(targetLevels?: SectionValueMap<number>): Record<HexSection, number> {
  const normalizedLevels = { ...minConfig.targetLevels };
  if (!targetLevels) {
    return normalizedLevels;
  }

  Object.entries(targetLevels).forEach(([sectionKey, level]) => {
    const section = normalizeSectionKey(sectionKey);
    if (section !== null && typeof level === "number") {
      normalizedLevels[section] = level;
    }
  });

  return normalizedLevels;
}

function normalizeText(text?: SectionValueMap<string>): HexagonConfig["text"] {
  const normalizedText: HexagonConfig["text"] = {};
  if (!text) {
    return normalizedText;
  }

  Object.entries(text).forEach(([sectionKey, value]) => {
    const section = normalizeSectionKey(sectionKey);
    if (section !== null && typeof value === "string") {
      normalizedText[section] = value;
    }
  });

  return normalizedText;
}

function mergeHexConfigInput(base: HexConfigInput, override: HexConfigInput): HexConfigInput {
  return {
    ...base,
    ...override,
    targetLevels: {
      ...(base.targetLevels || {}),
      ...(override.targetLevels || {})
    },
    text: {
      ...(base.text || {}),
      ...(override.text || {})
    },
    styles: {
      ...(base.styles || {}),
      ...(override.styles || {})
    },
    images: {
      ...(base.images || {}),
      ...(override.images || {})
    },
    backButton: {
      ...(base.backButton || {}),
      ...(override.backButton || {})
    },
    confusedButton: {
      ...(base.confusedButton || {}),
      ...(override.confusedButton || {})
    },
    actions: {
      ...(base.actions || {}),
      ...(override.actions || {})
    },
    configRefs: {
      ...(base.configRefs || {}),
      ...(override.configRefs || {})
    }
  };
}

function cloneHexagonConfig(config: HexagonConfig): HexagonConfig {
  const clonedConfig: HexagonConfig = {
    ...config,
    targetLevels: { ...config.targetLevels },
    styles: Object.fromEntries(Object.entries(config.styles).map(([key, value]) => [key, { ...value }])),
    actions: { ...config.actions },
    images: { ...config.images },
    text: { ...config.text },
    backButton: { ...config.backButton },
    confusedButton: config.confusedButton ? { ...config.confusedButton } : undefined
  };

  if (config.config) {
    clonedConfig.config = Object.fromEntries(Object.entries(config.config).map(([key, value]) => [key, cloneHexagonConfig(value)]));
  } else {
    delete clonedConfig.config;
  }

  return clonedConfig;
}

async function loadHomeConfig(): Promise<HomeRoot> {
  if (homeConfigPromise) {
    return homeConfigPromise;
  }

  homeConfigPromise = Promise.resolve()
    .then(async () => {
      const root = parse(getSierpinskiYamlSource("home.yml")) as HomeRoot;

      if (root.presetsFile) {
        const presetsDoc = await loadYamlDocument(root.presetsFile);
        const presetsFromFile = (presetsDoc as { presets?: Record<string, HexConfigInput> })?.presets || {};
        root.presets = {
          ...presetsFromFile,
          ...(root.presets || {})
        };
      }

      return root;
    });

  return homeConfigPromise;
}

async function loadYamlDocument(relativePath: string): Promise<unknown> {
  const normalizedPath = relativePath.replace(/^\/+/, "");
  if (yamlDocumentCache.has(normalizedPath)) {
    return yamlDocumentCache.get(normalizedPath)!;
  }

  const parsed = parse(getSierpinskiYamlSource(normalizedPath));
  yamlDocumentCache.set(normalizedPath, parsed);
  return parsed;
}

function isPageRefEntry(entry: PageEntry | PageRefEntry): entry is PageRefEntry {
  return typeof (entry as PageRefEntry).file === "string";
}

function isPageEntry(entry: unknown): entry is PageEntry {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const candidate = entry as Record<string, unknown>;
  return (
    Object.prototype.hasOwnProperty.call(candidate, "shared") ||
    Object.prototype.hasOwnProperty.call(candidate, "app") ||
    Object.prototype.hasOwnProperty.call(candidate, "page") ||
    Object.prototype.hasOwnProperty.call(candidate, "extends") ||
    Object.prototype.hasOwnProperty.call(candidate, "targetLevels") ||
    Object.prototype.hasOwnProperty.call(candidate, "text") ||
    Object.prototype.hasOwnProperty.call(candidate, "configRefs") ||
    Object.prototype.hasOwnProperty.call(candidate, "actions")
  );
}

function flattenPageTree(
  node: PageTree,
  prefix: string = "",
  out: Record<string, PageEntry | PageRefEntry> = {}
): Record<string, PageEntry | PageRefEntry> {
  Object.entries(node || {}).forEach(([key, value]) => {
    if (!value || typeof value !== "object") {
      return;
    }

    const pageId = prefix ? `${prefix}/${key}` : key;

    if (isPageRefEntry(value as PageEntry | PageRefEntry) || isPageEntry(value)) {
      out[pageId] = value as PageEntry | PageRefEntry;
    }

    const childTree: PageTree = {};
    Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
      if (["file", "shared", "app", "page", "extends", "targetLevels", "text", "configRefs", "actions", "styles", "images", "backButton", "confusedButton"].includes(childKey)) {
        return;
      }

      if (childValue && typeof childValue === "object") {
        childTree[childKey] = childValue as PageTree;
      }
    });

    if (Object.keys(childTree).length > 0) {
      flattenPageTree(childTree, pageId, out);
    }
  });

  return out;
}

function getBasePageInput(entry: PageEntry): HexConfigInput {
  const { shared: _shared, app: _app, page: _page, ...base } = entry;
  return base;
}

async function loadPageEntry(root: HomeRoot, pageId: string): Promise<PageEntry> {
  const pages = flattenPageTree(root.pages || {});
  const rawEntry = pages[pageId];
  if (!rawEntry) {
    throw new Error(`Unknown Sierpinski page id: ${pageId}`);
  }

  if (isPageRefEntry(rawEntry)) {
    const parsed = (await loadYamlDocument(rawEntry.file)) as PageEntry;
    return parsed || {};
  }

  return rawEntry;
}

function buildViewInput(entry: PageEntry, view: HexView): HexConfigInput {
  const base = getBasePageInput(entry);
  const shared = entry.shared || {};
  const specific = entry[view] || {};

  let merged = mergeHexConfigInput(base, shared);
  merged = mergeHexConfigInput(merged, specific);
  return merged;
}

function resolveWithExtends(root: HomeRoot, input?: HexConfigInput): HexConfigInput {
  const source = input || {};
  const extendsList = source.extends || [];
  let merged: HexConfigInput = {};

  extendsList.forEach((presetName) => {
    const preset = root.presets?.[presetName] || {};
    const presetResolved = resolveWithExtends(root, preset);
    merged = mergeHexConfigInput(merged, presetResolved);
  });

  const withoutExtends: HexConfigInput = { ...source };
  delete withoutExtends.extends;
  return mergeHexConfigInput(merged, withoutExtends);
}

function buildAction(actionSpec: ActionSpec, navigate: (url: string) => void): (hexagonId: number) => void {
  switch (actionSpec.type) {
    case "navigate":
      return () => {
        if (actionSpec.to) {
          navigate(actionSpec.to);
        }
      };
    case "transition":
      return (hexagonId: number) => {
        if (actionSpec.to) {
          performTransitionAndRedirect(hexagonId, actionSpec.to, navigate);
        }
      };
    case "external":
      return () => {
        if (!actionSpec.url) {
          return;
        }
        if (actionSpec.newTab === false) {
          window.location.href = actionSpec.url;
          return;
        }
        window.open(actionSpec.url, "_blank", "noopener,noreferrer");
      };
    case "reload":
      return () => {
        if (actionSpec.to) {
          window.location.href = actionSpec.to;
        }
      };
    case "alert":
      return (hexagonId: number) => {
        alert(actionSpec.message || `Hexagon ${hexagonId} clicked!`);
      };
    default:
      return () => {};
  }
}

async function resolveConfig(
  root: HomeRoot,
  pageId: string,
  view: HexView,
  navigate: (url: string) => void,
  visited: Set<string> = new Set()
): Promise<HexagonConfig> {
  const visitKey = `${pageId}:${view}`;
  if (visited.has(visitKey)) {
    throw new Error(`Circular Sierpinski config reference detected: ${visitKey}`);
  }

  const page = await loadPageEntry(root, pageId);

  const viewInput = resolveWithExtends(root, buildViewInput(page, view));
  const nextVisited = new Set(visited);
  nextVisited.add(visitKey);

  const actions: HexagonConfig["actions"] = {};
  Object.entries(viewInput.actions || {}).forEach(([sectionKey, spec]) => {
    if (!spec) {
      return;
    }
    actions[sectionKey] = buildAction(spec, navigate);
  });

  const normalizedConfusedButton = viewInput.confusedButton?.link ? { link: viewInput.confusedButton.link } : undefined;

  const config: HexagonConfig = {
    ...structuredClone(minConfig),
    ...viewInput,
    targetLevels: normalizeTargetLevels(viewInput.targetLevels),
    text: normalizeText(viewInput.text),
    styles: {
      ...structuredClone(minConfig.styles),
      ...(viewInput.styles || {})
    },
    images: {
      ...(viewInput.images || {})
    },
    actions,
    backButton: {
      ...structuredClone(minConfig.backButton),
      ...(viewInput.backButton || {})
    },
    confusedButton: normalizedConfusedButton
  };

  if (viewInput.configRefs) {
    const nested: Record<string, HexagonConfig> = {};
    const nestedPromises: Array<Promise<void>> = [];
    Object.entries(viewInput.configRefs).forEach(([section, ref]) => {
      if (!ref?.pageId) {
        return;
      }

      const nestedView = ref.view || "app";
      const nestedConfigPromise = resolveConfig(root, ref.pageId, nestedView, navigate, nextVisited);

      nestedPromises.push(
        nestedConfigPromise.then((nestedConfig) => {
          if (ref.overrides) {
            const overridden = cloneHexagonConfig(nestedConfig);

            // Only apply explicitly specified scalar overrides
            if (ref.overrides.title !== undefined) overridden.title = ref.overrides.title;
            if (ref.overrides.titleSize !== undefined) overridden.titleSize = ref.overrides.titleSize;
            if (ref.overrides.imageId !== undefined) overridden.imageId = ref.overrides.imageId;
            if (ref.overrides.textColor !== undefined) overridden.textColor = ref.overrides.textColor;
            if (ref.overrides.dropShadow !== undefined) overridden.dropShadow = ref.overrides.dropShadow;

            // Only override collection properties if they have actual entries
            if (ref.overrides.targetLevels && Object.keys(ref.overrides.targetLevels).length > 0) {
              overridden.targetLevels = normalizeTargetLevels(ref.overrides.targetLevels);
            }
            if (ref.overrides.text && Object.keys(ref.overrides.text).length > 0) {
              overridden.text = normalizeText(ref.overrides.text);
            }
            if (ref.overrides.images && Object.keys(ref.overrides.images).length > 0) {
              overridden.images = { ...overridden.images, ...ref.overrides.images };
            }
            if (ref.overrides.styles && Object.keys(ref.overrides.styles).length > 0) {
              overridden.styles = { ...overridden.styles, ...ref.overrides.styles };
            }
            if (ref.overrides.actions && Object.keys(ref.overrides.actions).length > 0) {
              const overrideActions: HexagonConfig["actions"] = {};
              Object.entries(ref.overrides.actions).forEach(([sectionKey, spec]) => {
                if (!spec) return;
                overrideActions[sectionKey] = buildAction(spec, navigate);
              });
              overridden.actions = { ...overridden.actions, ...overrideActions };
            }

            nested[section] = overridden;
            return;
          }

          nested[section] = nestedConfig;
        })
      );
    });

    await Promise.all(nestedPromises);

    if (Object.keys(nested).length > 0) {
      config.config = nested;
    }
  }

  return config;
}

export async function loadSierpinskiPageConfig(pageId: string, navigate: (url: string) => void): Promise<HexagonConfig> {
  const root = await loadHomeConfig();
  return await resolveConfig(root, pageId, "page", navigate);
}

export async function loadSierpinskiAppConfig(pageId: string, navigate: (url: string) => void): Promise<HexagonConfig> {
  const root = await loadHomeConfig();
  return await resolveConfig(root, pageId, "app", navigate);
}

// Automatically generated by GDevelop.js/scripts/generate-types.js
declare class gdVectorEventsSearchResult {
  constructor(): void;
  clone(): gdVectorEventsSearchResult;
  push_back(result: gdEventsSearchResult): void;
  resize(size: number): void;
  size(): number;
  at(index: number): gdEventsSearchResult;
  set(index: number, result: gdEventsSearchResult): void;
  clear(): void;
  delete(): void;
  ptr: number;
};
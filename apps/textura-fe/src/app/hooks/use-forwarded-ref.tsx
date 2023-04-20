import React from "react";

import { useRef } from 'react';

export function useForwardedRef<T>(forwardedRef: React.Ref<T>): React.Ref<T | undefined> {
  const ref = useRef<T>();

  return forwardedRef ?? ref;
}

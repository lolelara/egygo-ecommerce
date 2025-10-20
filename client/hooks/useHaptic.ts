export function useHaptic() {
  const vibrate = (pattern: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const light = () => vibrate(10);
  const medium = () => vibrate(20);
  const heavy = () => vibrate(30);
  const success = () => vibrate([10, 50, 10]);
  const error = () => vibrate([50, 100, 50]);
  const warning = () => vibrate([30, 50, 30]);

  return {
    vibrate,
    light,
    medium,
    heavy,
    success,
    error,
    warning
  };
}

// Lightweight auth stub used while developing locally.
// Replace this with a real store (e.g. zustand or context) when ready.

export function useAuthStub() {
  return {
    isAdmin: false,
    setIsAdmin: (_: boolean) => {},
  };
}

export default useAuthStub;
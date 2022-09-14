type GlobalContextProps = {
    children: React.ReactNode;
};

// TODO: Determine whether this is actually needed.
const GlobalContext = ({ children }: GlobalContextProps) => {
  return (
    <>
        {children}
    </>
  )
}
export default GlobalContext
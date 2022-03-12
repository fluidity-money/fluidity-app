import Icon from "components/Icon";

const AppContainer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <div className='app-container gradient-background'>
      {children}
      {/* Fluidity text footer */}
      <div className='fluidity flex row flex-space-between width-auto'>
        <Icon src='i-fluidity-medium' />
        <div className='fluidity-text'>Fluidity.</div>
      </div>
    </div>
  );
};

export default AppContainer;

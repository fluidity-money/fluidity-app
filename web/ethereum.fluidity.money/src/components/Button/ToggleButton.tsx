interface IProps {
  toggled: boolean;
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleButton = ({ toggled, toggle }: IProps) => {
  return (
    <>
      <div className="toggle-bar" onClick={() => toggle(!toggled)}>
        <div
          className={toggled ? "toggle-slider-right" : "toggle-slider-left"}
        ></div>
      </div>
    </>
  );
};

export default ToggleButton;

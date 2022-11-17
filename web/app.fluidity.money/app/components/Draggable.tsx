import { useDrag } from "react-dnd";

type Props = {
  dragItem: unknown;
  type: string;
  key: string;
  children: React.ReactNode;
};

const Draggable = (props: Props) => {
  const { dragItem, type, children, key } = props;

  const drag = useDrag(() => {
    return {
      type: type,
      item: dragItem,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    };
  }, [dragItem])[1];

  return (
    <div ref={drag} key={key}>
      {children}
    </div>
  );
};

export default Draggable;

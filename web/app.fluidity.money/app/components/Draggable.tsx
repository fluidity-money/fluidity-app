import { useDrag } from "react-dnd";

type Props = {
  dragItem: unknown;
  type: string;
  children: React.ReactNode;
};

const Draggable = (props: Props) => {
  const { dragItem, type, children } = props;

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
    <div ref={drag}>
      {children}
    </div>
  );
};

export default Draggable;

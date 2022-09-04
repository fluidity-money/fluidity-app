interface IItem {
    title: string;
    src: string;
    type: "internal" | "external";
}
interface IFooterItemProps {
    children: string;
    items: IItem[];
}
declare const FooterItem: ({ children, items }: IFooterItemProps) => JSX.Element;
export default FooterItem;

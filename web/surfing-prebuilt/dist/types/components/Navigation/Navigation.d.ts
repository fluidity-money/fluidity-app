interface INavigation {
    page: string;
    pageLocations: string[];
}
declare const Navigation: ({ pageLocations, page }: INavigation) => JSX.Element;
export default Navigation;

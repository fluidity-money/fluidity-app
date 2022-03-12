const AppBody = ({
    direction,
    alignment,
    children
}: {
    direction: string;
    alignment: string;
    children: JSX.Element | JSX.Element[]
}) => {
    return <div className={`${direction} flex-${alignment} app-body`}>
        {children}
    </div>
}

export default AppBody;
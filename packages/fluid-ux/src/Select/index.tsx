import { useMemo } from 'react';
import type { ReactElement } from 'react';
import * as styles from "./Select.module.sass"

type OptionProps = {name: string, children: string}
const Option = (_: OptionProps) =>  {
    return <></>
}

/**
 * # Select
 * ## Implementation notes
 * This looks a bit more scuffed than it is.
 * 
 * So... We can't use the `<select>` element because it doesn't support
 * theming of its dropdown. So we have to use a `<div>` and then
 * use a `<select>` inside of it. Not the most elegant solution, but
 * it works.
 * 
 * Now, I'm sure you're wondering why even use a `<select>` element
 * when you can use a `<div>` element. Well, it's because the `<select>`
 * is much better for a screen reader and keyboard users.
 */
const Select = (props: {
    onChange?: (value: string) => void,
    value?: string,
    placeholder?: string,
    children?: ReactElement<OptionProps>[] | ReactElement<OptionProps>,
}): JSX.Element => {
    const options = useMemo(() => {

        if (!props.children) {
            return [];
        }
        if (!Array.isArray(props.children)) {
            props.children = [props.children];
        }
        return props.children.map((option: ReactElement<OptionProps>) => {
            return option.props
        })
    }, [props.children])

    return <>
        <div className={styles.select}>
            <select className={styles.srOnly} value={props.value}>
                
            </select>
        </div>
    </>
}

export default Select;
export { Option };
import * as React from 'react';
import { FC } from 'react';
import { useQuery } from '@/hooks/useQuery';
import * as styles from './EnumFilter.module.scss';
import { useHistory } from 'react-router';


// tslint:disable-next-line: variable-name
export const EnumFilter: FC<Props> = ({ id, multiple, className, title, children }) => {

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            const listener = () => {
                setOpen(false);
            };
            document.body.addEventListener('click', listener);
            return () => {
                document.body.removeEventListener('click', listener);
            };
        }
    }, [open]);

    const childrenTransformed = React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
            return null;
        }

        return React.cloneElement(child, {
            _filterName: id,
            _multiple: multiple,
        });
    });

    className = className ?? '';

    return <div className={`p-10 ${className} ${styles.enumFilter}`}>
        <span className={styles.title} onClick={() => setOpen(true)}>
            {title} <span className={styles.arrowDown} />
        </span>
        <FilterMenu title={title} open={open}>
            {childrenTransformed}
        </FilterMenu>
    </div>;
};

interface Props {
    /**
     * This id is used in the search bar to show this filter
     */
    id: string
    /**
     * Class name to set to the main div element
     */
    className?: string
    /**
     * True if multiple value can be selected.
     */
    multiple?: boolean
    /**
     * This is the title of the filter shown in the popup menu
     */
    title: React.ReactNode
}

// tslint:disable-next-line: variable-name
export const EnumFilterEntry: FC<EntryProps> = ({ value, _multiple, _filterName, children }) => {

    if (!_filterName) {
        throw new Error('Bug found!');
    }

    const query = useQuery();
    const history = useHistory();
    const currentValue = query.get(_filterName);
    const checked = currentValue && _multiple && currentValue.split(',').indexOf(value) !== -1
        || currentValue && !_multiple && currentValue === value;

    function onClick() {
        let newValue = currentValue ?? '';
        if (!checked) {
            if (_multiple && newValue !== '') {
                newValue = newValue + ',' + value;
            } else {
                newValue = value;
            }
        } else {
            if (_multiple) {
                newValue = newValue.split(',').filter(v => v !== value).join(',');
            } else {
                newValue = '';
            }
        }
        if (newValue === '') {
            query.delete(_filterName!);
        } else {
            query.set(_filterName!, newValue);
        }
        history.push({ search: query.toString() });
    }

    return <div onClick={onClick} className={`${styles.option} ${checked ? styles.checked : ''}`}>
        {children} <i className="fas fa-check"/>
    </div>;
};

interface EntryProps {
    /**
     * Value of this entry
     */
    value: string

    /**
     * You should not provide this value
     * @private
     */
    _multiple?: boolean

    /**
     * You should not provide this value
     * @private
     */
    _filterName?: string
}

// tslint:disable-next-line: variable-name
const FilterMenu: FC<FilterMenuProps> = ({ open, children, title }) => {

    return <div className={`${styles.menu} ${open ? styles.open : ''}`} >
        <div className={styles.title}>{title}</div>
        {children}
    </div>;
};

interface FilterMenuProps {
    open: boolean
    title: React.ReactNode
}

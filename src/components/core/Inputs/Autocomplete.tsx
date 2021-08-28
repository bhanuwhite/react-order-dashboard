import * as React from 'react';
import { ReactElement, PropsWithChildren, SFC } from 'react';
import { AppendIcon, PrependIcon } from './TextField';
import { newIdGenerator } from '@/utils/uniqueId';
import useAutocomplete, { FilterOptionsState } from '@material-ui/lab/useAutocomplete';


// tslint:disable-next-line: variable-name
export function Autocomplete<T>({
    // CSS class for the root element
    className,
    // Icon to prepend to the input
    prependIcon,
    // Icon to append to the input
    appendIcon,
    // Placeholder for the autocomplete box.
    label,
    // If true, the autocomplete will allow selecting multiple values.
    multiple,
    // If true, a spinner is shown
    loading,
    // Set to true to have the label shown above the field and inside the textfield border.
    innerLabelAbove,
    // If true, the field should be shown as containing an invalid value.
    invalid,
    // A filter function that determines the options that are eligible
    filterOptions,
    // If true, nothing is shown when there are no options matching the search
    hideNoResultFound,
    // Control the popup open state.
    open,
    // Callback fired when the popup requests to be opened. Use in controlled mode (see open).
    onOpen,
    // Callback fired when the popup requests to be closed. Use in controlled mode (see open).
    onClose,
    // Click handler for the appended icon
    onAppendIconClick,
    // Save a reference to the Autocomplete input ref in a parent component
    saveInputRef,
    // If true, user input is not limited to provided options
    freeSolo,
    // Render an option in the list of suggestions
    renderOption,
    // Options to give to the user can be any object.
    options,
    // Function that transform an option into a string.
    getOptionLabel,
    // Default value
    defaultValue,
    // Value to set the input to (only if component is used in controllable mode)
    value: pValue,
    // Callback fired when the value changes.
    onChange,
    // Input value to set the input to (only if component is used in controllable mode)
    // Note that if value is not null, value has authority over inputValue.
    inputValue: pInputValue,
    // Callback fired when the input value changes.
    onInputChange,
    // If provided, the options will be grouped under the returned string.
    // The groupBy value is also used as the text for group headings when `renderGroup` is not provided.
    groupBy,
    // If `true`, the first option is automatically highlighted.
    autoHighlight,
}: PropsWithChildren<Props<T>>): ReactElement | null {

    const [id] = React.useState(newId);
    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        popupOpen,
        focused,
        value,
        inputValue,
        setAnchorEl,
    } = useAutocomplete({
        id,
        options,
        multiple,
        getOptionLabel,
        onChange,
        onInputChange,
        freeSolo,
        defaultValue,
        value: pValue,
        inputValue: pInputValue,
        debug: false,
        groupBy,
        autoHighlight,
        filterOptions,
        open,
        onOpen,
        onClose,
    });

    const classes = ['text-field', 'autocomplete'];
    if (className) {
        classes.push(className);
    }
    if (focused) {
        classes.push('focus');
    }
    if (invalid) {
        classes.push('invalid');
    }
    if (innerLabelAbove) {
        classes.push('inner-label-above');
    }
    if (groupedOptions.length > 0) {
        classes.push('has-matches');
    }

    label = !innerLabelAbove && (focused || inputValue !== '') ? '' : label;
    if (multiple) {
        label = value.length > 0 ? '' : label;
    }

    const inputProps = getInputProps() as { ref: React.RefObject<HTMLInputElement> };

    React.useEffect(() => {
        saveInputRef?.(inputProps.ref);
    }, [ inputProps.ref ]);

    return <div className={classes.join(' ')}>

        <div className="text-field-content" {...getRootProps()}>
            {prependIcon ? <PrependIcon icon={prependIcon} /> : null}
            {multiple ?
                value.map((option: T, index: number) => (
                    <Tag label={getOptionLabel(option)} {...getTagProps({ index })} />
                )) :
                null
            }
            <div ref={setAnchorEl} className="text-field--inner">
                {label ? <label {...getInputLabelProps()}>{label}</label> : null}
                <input {...inputProps} />
            </div>
            <LoadingIcon loading={!!loading} />
            {appendIcon ? <AppendIcon icon={appendIcon} onClick={onAppendIconClick}/> : null}
        </div>

        {!hideNoResultFound && inputValue && groupedOptions.length === 0 && focused && (
            <NoResultsFound getListboxProps={getListboxProps} />
        )}

        {popupOpen ? (
            groupedOptions.length > 0 ?
            <ul className={`autocomplete-results${multiple ? ' multiple' : ''}${invalid ? ' invalid' : ''}`}
                {...getListboxProps()}>
                {groupedOptions.map((option, index) => (
                    <li className="result" {...getOptionProps({ option, index })}>
                        {renderOption ?
                            renderOption(option) :
                            <>
                                <span>{getOptionLabel(option)}</span>
                                <i className="fas fa-check"></i>
                            </>
                        }
                    </li>
                ))}
            </ul> :
            null
        ) : null}
    </div>;
}

type Props<T> = MultipleSelectProps<T> | SingleSelectProps<T>;

interface MultipleSelectProps<T> extends BaseProps<T> {
    /**
     * Allow selecting multiple values.
     */
    multiple: true
    /**
     * Callback fired when the value changes.
     *
     * @param event The event source of the callback.
     * @param value is an array if multiple is true otherwise it represent the new value selected.
     */
    onChange?: (event: React.ChangeEvent<{}>, value: T[] | null) => void
}

interface SingleSelectProps<T> extends BaseProps<T> {
    multiple?: false
    /**
     * Callback fired when the value changes.
     *
     * @param event The event source of the callback.
     * @param value is an array if multiple is true otherwise it represent the new value selected.
     */
    onChange?: (event: React.ChangeEvent<{}>, value: T | string | null) => void
}

interface BaseProps<T> {
    /**
     * Additional class to pass to the root element.
     */
    className?: string
    /**
     * Prepend an icon to the input.
     */
    prependIcon?: string
    /**
     * Append an icon to the input.
     */
    appendIcon?: string
    /**
     * Label for the input (aka placeholder)
     */
    label?: string
    /**
     * If true then instead of showing the suggestions, show a spinner
     */
    loading?: boolean
    /**
     * Set to true to have the label shown above the field and inside the textfield border.
     */
    innerLabelAbove?: boolean
    /**
     * If true, the field should be shown as containing an invalid value.
     */
    invalid?: boolean
    /**
     * A filter function that determines the options that are eligible
     */
    filterOptions?: (options: any[], state: FilterOptionsState) => any[]
    /**
     * If true, nothing is shown when there are no options matching the search
     */
    hideNoResultFound?: boolean
    /**
     * Control the popup open state.
     */
    open?: boolean
    /**
     * Callback fired when the popup requests to be opened. Use in controlled mode (see open).
     */
    onOpen?: () => void
    /**
     * Callback fired when the popup requests to be closed. Use in controlled mode (see open).
     */
    onClose?: () => void
    /**
     * Click handler for the appended icon
     */
    onAppendIconClick?: ()  => void
    /**
     * Save a reference to the Autocomplete input ref in a parent component
     */
    saveInputRef?: (ref: React.RefObject<HTMLInputElement>) => void
    /**
     * If true user input is not bound to provided options (Solve Home/End key navigation)
     */
    freeSolo?: boolean
    /**
     * Render an option in the list of suggestions
     */
    renderOption?: (option: T) => ReactElement | null
    /**
     * Suggestions to show to the user based on the input the user has entered.
     */
    options: T[]
    /**
     * Transform an option into a string (shown to the user)
     *
     * @param option
     */
    getOptionLabel: (option: T) => string
    /**
     * Default value. Only if component is used in controllable mode
     */
    defaultValue?: T
    /**
     * The value of the autocomplete.
     *
     * The value must have reference equality with the option in order to be selected.
     * It also shouldn't be used in conjunction with inputValue.
     */
    value?: T
    /**
     * The input value. Required if you want to use the Autocomplete
     * component in Controllable mode.
     */
    inputValue?: string
    /**
     * Callback fired when the input value changes.
     *
     * @param event The event source of the callback.
     * @param value The new value of the text input.
     * @param reason Can be: "input" (user input), "reset" (programmatic change), `"clear"`.
     */
    onInputChange?: (event: React.ChangeEvent<{}>, value: string, reason: 'input' | 'reset' | 'clear') => void
    /**
     * If provided, the options will be grouped under the returned string.
     * The groupBy value is also used as the text for group headings when `renderGroup` is not provided.
     *
     * @param {any} options The option to group.
     * @returns {string}
     */
    groupBy?: (opt: T) => string
    /**
     * If `true`, the first option is automatically highlighted.
     */
    autoHighlight?: boolean
    /**
     * TODO: if a custom "No results found" component is desired,
     * we can revive this `renderNoResult` prop that Joan started working on here:
     *
     *   <ul className="autocomplete-results" {...getListboxProps()}>
     *     {renderNoResult?.(inputValue)}
     *   </ul>
     *
     * Render a component when no option matched the search
     */
    // renderNoResult?: (inputValue: string) => ReactElement | null
}

// tslint:disable-next-line: variable-name
const NoResultsFound: React.FC<{ getListboxProps: () => {} }> = ({ getListboxProps }) => (
    <ul className="autocomplete-results" {...getListboxProps()}>
        <li className="result"
            role="option"
            id="no-results-found"
            data-tabindex="-1"
            aria-disabled="true"
            aria-selected="false"
        >
            <span>No results found.</span>
        </li>
    </ul>
);

// tslint:disable-next-line: variable-name
const Tag: SFC<any> = ({ label, onDelete, ...props }) => (
    <div className="autocomplete-tag" {...props}>
        <span>{label}</span>
        <i onClick={onDelete} className="fas fa-times" />
    </div>
);

// tslint:disable-next-line: variable-name
const LoadingIcon: SFC<{ loading: boolean }> = ({ loading }) => (
    <div className={`autocomplete-status${loading ? ' loading' : ''}`}>
        <i className="fas fa-spinner" />
    </div>
);

const newId = newIdGenerator('autocomplete');
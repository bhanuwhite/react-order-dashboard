import * as React from 'react';
import { Button } from '@/components/core';
import { TextField } from '@/components/core/Inputs';


// tslint:disable-next-line: variable-name
export const SearchBar = React.forwardRef<WrappedHTMLInputElement, SearchBarProps>((
    {
        placeholder,
        className,
        buttonClassName,
        searchQuery,
        info,
        setSearchQuery,
        doSearch,
        button,
    },
    ref,
) => {

    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleClearSearch = () => {
        setSearchQuery('');
        inputRef.current?.focus();
    };

    React.useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
    }));

    const buttonProps: ButtonProps = {
        onClick: doSearch,
        type: 'submit',
        className: `search-button ${buttonClassName ?? ''}`,
        primary: !info,
        info,
    };

    return <form onSubmit={(e) => e.preventDefault()} className={'search-bar' + (className ? ` ${className}` : '')}>
        <TextField
            className="search-input"
            inputRef={inputRef}
            value={searchQuery}
            onChange={setSearchQuery}
            label={placeholder ?? ''}
            prependIcon="fas fa-search"
            appendIcon={searchQuery ? 'fas fa-times fa-lg' : ''}
            onAppendIconClick={searchQuery ? handleClearSearch : undefined}
        />
        {
            button ? button(buttonProps) :
            <Button {...buttonProps}>
                Search
            </Button>
        }
    </form>;
});

interface SearchBarProps {
    className?: string
    buttonClassName?: string
    placeholder?: string
    searchQuery: string
    button?: (buttonProps: ButtonProps) => React.ReactNode;
    info?: boolean
    doSearch: () => void
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

interface ButtonProps {
    onClick: () => void
    type: 'submit'
    primary: boolean
    info?: boolean
    className: string
}

interface WrappedHTMLInputElement {
    focus(): void
}
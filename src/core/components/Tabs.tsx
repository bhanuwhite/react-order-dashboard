import * as React from 'react';
import { FC } from 'react';
import { createLocation } from 'history';
import { matchPath } from 'react-router';
import { useLocation, Link } from 'react-router-dom';

/**
 * `TabBar` is the parent containing all the tabs:
 * ```tsx
 * <TabBar>
 *      <Tab>First Tab</Tab>
 *      <Tab>Second Tab</Tab>
 * </TabBar>
 * ```
 */
// tslint:disable-next-line: variable-name
export const TabBar: FC<TabBarProps> = ({ className, tabsClassName, children, value, onChange }) => {

    className = `flex overflow-hidden z-20 ${className ? className : ''}`;

    let childIndex = 0;
    const childrenTransformed = React.Children.map(children, child => {
        if (!React.isValidElement(child)) {
            return null;
        }

        const selected = value === childIndex;
        const childValue = childIndex;

        childIndex += 1;
        return React.cloneElement(child, {
            selected,
            onChange,
            value: childValue,
        });
    });

    return <div className={className} style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className={computeTabsClassName(tabsClassName)}>
            {childrenTransformed}
        </div>
    </div>;
};
interface TabBarProps {
    className?: string
    tabsClassName?: string
    onChange: (event: React.ChangeEvent<{}>, newValue: number) => void
    value: number
}

/**
 * `RoutedTabBar` is the parent containing all the tabs that are link:
 * ```tsx
 * <RoutedTabBar>
 *      <LinkTab>First Tab</LinkTab>
 *      <LinkTab>Second Tab</LinkTab>
 * </RoutedTabBar>
 * ```
 */
// tslint:disable-next-line: variable-name
export const RoutedTabBar: FC<RoutedTabBarProps> = ({ className, tabsClassName, children }) => {

    className = `flex z-20 ${className ? className : ''}`;

    // Modified version of
    //
    //    https://github.com/ReactTraining/react-router/blob/v5.1.2/packages/react-router-dom/modules/NavLink.js
    //
    // We do the check in the TabBar to only match a single tab.
    // The match is based on the path length.
    //

    const currentLocation = useLocation();

    let activeIndex = -1;
    let maxActiveLength = 0;

    React.Children.forEach(children, (child, index) => {
        if (!React.isValidElement(child)) {
            return null;
        }

        const to = child.props.to;
        if (typeof to !== 'string') {
            return null;
        }

        const toLocation = createLocation(to, undefined, undefined, currentLocation);
        const path = toLocation.pathname;
        // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
        const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

        if (escapedPath) {

            const match = matchPath(currentLocation.pathname, {
                path: escapedPath,
                exact: child.props.exact,
                strict: false,
            });
            if (match && to.length > maxActiveLength) {
                maxActiveLength = to.length;
                activeIndex = index;
            }
        }
    });

    const childrenTransformed = React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
            return null;
        }

        const toLocation = createLocation(child.props.to, undefined, undefined, currentLocation);

        return React.cloneElement(child, {
            to: toLocation,
            _isActive: index === activeIndex,
        });
    });

    return <div className={className}  style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className={computeTabsClassName(tabsClassName)}>
            {childrenTransformed}
        </div>
    </div>;
};
interface RoutedTabBarProps {
    className?: string
    tabsClassName?: string
}

/**
 * The `LinkTab` component is to be used with `RoutedTabBar`. It allows
 * to have that change the route depending on their `to` property.
 */
// tslint:disable-next-line: variable-name
export const LinkTab: FC<LinkTabProps> = ({ to, _isActive, children, badge, dataQaComponent }) => {

    let className = 'relative inline-block h-8 transition-colors outline-none focus-visible:outline-black'
        // After classes
        + ' after:transition-colors after:absolute after:bottom-0 after:h-1.5 after:left-0 after:right-0 ';

    if (_isActive) {
        className += 'text-primary hover:text-primary-light after:bg-primary hover:after:bg-primary-light';
    } else {
        className += 'text-gray-400 hover:text-neutral after:bg-transparent hover:after:bg-neutral';
    }

    const isBadgeDefined = typeof badge !== 'undefined';
    const badgeClassName = 'inline-block rounded-full text-white px-2 ml-2 ' +
        (_isActive ? 'bg-primary' : 'bg-bad');

    return <Link to={to} className={className} role="tab" aria-current={_isActive ? 'page' : undefined}
        data-qa-component={dataQaComponent} >
        {children}
        {isBadgeDefined && <span className={badgeClassName}>
            {badge}
        </span>}
    </Link>;
};

interface LinkTabProps {
    /** Link this tab should link to */
    to: string
    /** A badge (typically a count) to place next to the children */
    badge?: React.ReactNode
    /** Whether the location should match exactly */
    exact?: boolean
    /** Used for QA testing */
    dataQaComponent?: string
    /** DO NOT USE */
    _isActive?: boolean
}

/**
 * The `Tab` component is to be used with `TabBar`. It allows
 * to have multiple tabs into a component. All props should be ignored.
 * They are populated by the `TabBar` component.
 */
// tslint:disable-next-line: variable-name
export const Tab: FC<TabProps> = ({ value, selected, onChange, children }) => {

    let className = 'cursor-pointer relative inline-block h-8 transition-colors after:transition-colors after:absolute after:bottom-0 after:h-1.5 after:left-0 after:right-0 ';

    if (selected) {
        className += 'text-primary hover:text-primary-light after:bg-primary hover:after:bg-primary-light';
    } else {
        className += 'text-gray-400 hover:text-neutral after:bg-transparent hover:after:bg-neutral';
    }

    return <div className={className} role="tab"
        onClick={e => onChange!(e, value!)}
    >
        {children}
    </div>;
};
interface TabProps {
    // Those props should not be specified by the user
    selected?: boolean
    value?: number
    onChange?: (event: React.ChangeEvent<{}>, newValue: number) => void
}


// tslint:disable-next-line: variable-name
export const TabPanel: FC<TabPanelProps> = ({ value, index, children }) => (
    <div role="tabpanel">
        {value === index ? children : null}
    </div>
);
interface TabPanelProps {
    value: number
    index: number
}

const SCROLLER = 'uppercase font-bold relative inline-block flex-auto whitespace-nowrap overflow-x-scroll lg:overflow-visible no-scrollbar';

function computeTabsClassName(tabsClassName: string | undefined): string {

    tabsClassName = tabsClassName ?? '';

    if (tabsClassName.includes('space-x')) {
        return `${SCROLLER} ${tabsClassName}`;
    }

    return `${SCROLLER} ${tabsClassName} space-x-3`;
}
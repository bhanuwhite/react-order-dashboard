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
export const TabBar: FC<TabBarProps> = ({ className, children, value, withinContent, onChange }) => {

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
            withinContent,
            value: childValue,
        });
    });

    const classes = ['tab-bar wrapper transparent large'];
    if (className) {
        classes.push(className);
    }

    return <div className={classes.join(' ')}>
        <div className="scroller">
            {childrenTransformed}
        </div>
    </div>;
};
interface TabBarProps {
    className?: string
    onChange: (event: React.ChangeEvent<{}>, newValue: number) => void
    value: number
    // tabs are inside component content vs. outside the container
    withinContent?: boolean
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
export const RoutedTabBar: FC<RoutedTabBarProps> = ({ className, children }) => {

    const classes = ['tab-bar wrapper transparent large'];
    if (className) {
        classes.push(className);
    }

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

    return <div className={classes.join(' ')}>
        <div className="scroller">
            {childrenTransformed}
        </div>
    </div>;
};
interface RoutedTabBarProps {
    className?: string
}

/**
 * The `LinkTab` component is to be used with `RoutedTabBar`. It allows
 * to have that change the route depending on their `to` property.
 */
// tslint:disable-next-line: variable-name
export const LinkTab: FC<LinkTabProps> = ({ to, _isActive, children, dataQaComponent }) => {

    let className = 'tab-item';

    if (_isActive) {
        className += ' active';
    }

    return <Link to={to} className={className} role="tab" aria-current={_isActive ? 'page' : undefined}
        data-qa-component={dataQaComponent} >
        {children}
    </Link>;
};

interface LinkTabProps {
    /** Link this tab should link to */
    to: string
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
export const Tab: FC<TabProps> = ({ value, selected, withinContent, onChange, children }) => {
    const baseClass = withinContent ? 'within-content-tab-item' : 'tab-item';
    return <div className={baseClass + (selected ? ' active' : '')} role="tab"
        onClick={e => onChange!(e, value!)}
    >
        {children}
    </div>;
};
interface TabProps {
    // Those props should not be specified by the user
    selected?: boolean
    value?: number
    withinContent?: boolean
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
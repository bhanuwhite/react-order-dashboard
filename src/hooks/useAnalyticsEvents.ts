import React from 'react';

export function useAnalyticsEvents() {

    function sendAnalyticsEvent(eventName: string, eventCategory?: string, eventLabel?: string) {
        window.gtag?.('event', eventName, {
            ...(eventCategory && {
                event_category: eventCategory,
            }),
            ...(eventLabel && {
                event_label: eventLabel,
            }),
        });
    }

    React.useEffect(() => {
        if (!window.gtag) {
            console.error('Analytics gtag must first be instantiated on window in order to useAnalyticsEvents');
        }
    }, []);

    return {
        sendAnalyticsEvent,
    };
}
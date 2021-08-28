import { DerivedOrderStatus, OrderState } from '@/store/domain/vff/orders';


export function bkgStatus(derivedStatus: DerivedOrderStatus): string {
    switch (derivedStatus) {
        case DerivedOrderStatus.Canceled: return 'bkg-primary';
        case DerivedOrderStatus.Processing: return 'bkg-light-grey';
        case DerivedOrderStatus.Delivered: return 'bkg-healthy';
        case DerivedOrderStatus.Shipped: return 'bkg-info';
    }
}

export function formatStatus(derivedStatus: DerivedOrderStatus): string {
    switch (derivedStatus) {
        case DerivedOrderStatus.Canceled: return 'Canceled';
        case DerivedOrderStatus.Processing: return 'Processing order';
        case DerivedOrderStatus.Delivered: return 'Delivered';
        case DerivedOrderStatus.Shipped: return 'Shipped';
    }
}

export function trackOrderLink(order: OrderState): string {
    // Don't ask me why but they encode it twice on ups site.
    // See https://www.ups.com/track?loc=en_US&tracknum=123456%250D%250A4554654654&requester=WT/
    const encoded = encodeURIComponent(encodeURIComponent(
        order.props.children.map(c => c?.fulfillment_tracking).join('\r\n'),
    ));
    return `https://ups.com/track?loc=en_US&tracknum=${encoded}&requester=WT/`;
}
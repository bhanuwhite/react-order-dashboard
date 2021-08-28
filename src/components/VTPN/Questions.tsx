import { FC } from 'react';


const supportPhoneNumber = '+1 (855) 488-7332';

// tslint:disable-next-line: variable-name
export const Questions: FC<{}> = () => (
    <div className="bkg-grey-242 p-30 mb-20">
        <div className="text-primary font-size-18">We are here to help</div>
        <br/>
        <div className="font-light">
            For questions or bulk ordering requests, you can reach us Mon-Fri between 9:30 AM to 5:30 PM (EST)
        </div>
        <br/>
        <div className="mt-10 font-size-20 font-bold">
            <a className="text-dark-grey no-underline hover:underline" href={`tel:${supportPhoneNumber}`}>
                {supportPhoneNumber}
            </a>
        </div>
    </div>
);
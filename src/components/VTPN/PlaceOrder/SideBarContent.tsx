import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Questions } from '../Questions';


// tslint:disable-next-line: variable-name
export const SideBarContent: FC<{ confirmationPage: boolean }> = ({ confirmationPage }) => (
    <div className="w-full lg:w-450 flex-shrink-0">
        <div className="bkg-grey-242 p-30 mb-20">
            <div className="text-primary font-size-18">Free for 30 Days</div>
            <br/>
            <div className="font-light">
                Order now to experience vTPN and 4G data services for free{' '}
                for your first 30-days.
            </div>
            <br/>
            <ul className="font-size-14 list-disc pl-20">
                <li className="mb-5">Your 30-day trial will begin upon delivery of your VeeaHub Smart Edge Nodes.</li>
                <li className="mb-5">We'll send you a reminder e-mail 7 days before your trial ends</li>
            </ul>
        </div>

        <Questions />

        {!confirmationPage && <div className="bkg-grey-242 p-30">
            <div className="text-primary font-size-18">Track your order</div>
            <br />
            <div className="font-light">{`
              Need to check the status of a previous order?
          `}</div>
            <br />
            <Link to="/my-orders" className="text-info no-underline hover:underline font-bold pt-5 pr-5 pb-5">
                Previous Orders
          </Link>
        </div>}
    </div>
);
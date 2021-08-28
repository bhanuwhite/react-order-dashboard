import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const NotAllowed: FC<Props> = ({}) => (
    <div className="mb-4 mx-4 md:mx-0">
        <h1 className="text-2xl mb-4">Not authorised</h1>
        <div className="rounded border bg-white border-solid border-gray-300 py-80 text-center text-gray-500">
            We can't let you see this page.
            To access this page, you may need to{' '}
            <a className="text-primary hover:underline" href="/logout">log in with another account</a>
        </div>
    </div>
);

interface Props {}

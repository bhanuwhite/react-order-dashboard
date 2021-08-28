import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const PageNotFound: FC<Props> = ({}) => (
    <div className="mb-4 mx-4 md:mx-0">
        <h1 className="text-2xl mb-4">Page Not Found</h1>
        <div className="rounded border bg-white border-solid border-gray-300 py-80 text-center text-gray-500">
            Oops you've found a dead link =)
        </div>
    </div>
);

interface Props {}

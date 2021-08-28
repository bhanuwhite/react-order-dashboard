import { FC } from 'react';


// tslint:disable-next-line: variable-name
export const GlobalSearchMobile: FC<Props> = ({}) => (
    <div className="mt-14 flex items-center text-sm text-gray-400 lg:hidden px-4 bg-gray-200 border-b border-solid border-gray-300 h-12">
        <i className="fas fa-search ml-2 mr-3" />
        <div>
            Search for devices, places and more
        </div>
    </div>
);

interface Props {}

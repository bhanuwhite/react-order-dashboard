import { FC } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Separator, PageIntro } from '@/components/core';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';
import { HeadTitle } from '@/components/core';


// tslint:disable-next-line: variable-name
export const Unauthorized: FC<{}> = observer(({}) => {

    const history = useHistory();
    const store = useStore();
    const prevLocation = store.history.prevLocation || '/cc';

    return <>
        <HeadTitle>Veea Control Center - 401</HeadTitle>
        <PageIntro title="Not allowed" icon="icon-102_Bug">
            <Link to={prevLocation} onClick={() => history.goBack()}>
                <i className="fas fa-chevron-left"></i>Go back
            </Link>
        </PageIntro>
        <Container solid>
            <UnauthorizedContent to={prevLocation} onClick={() => history.goBack()} />
        </Container>
    </>;
});

// tslint:disable-next-line: variable-name
export const UnauthorizedBody: FC<{}> = observer(() => {
    const history = useHistory();
    const store = useStore();
    const prevLocation = store.history.prevLocation || '/cc';

    return <UnauthorizedContent to={prevLocation} onClick={() => history.goBack()} />;
});

// tslint:disable-next-line: variable-name
const UnauthorizedContent: FC<{ to: string, onClick(): void }> = ({ to, onClick }) => (
<>
    <h1><b>We can't let you see this page</b></h1>
    To access this page, you may need to{' '}
    <a className="no-underline hover:underline" href="/logout">log in with another account</a>.
    <Separator></Separator>
    <Link to={to} onClick={onClick}>Go back</Link>
</>
);
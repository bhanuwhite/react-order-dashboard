import { FC } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Container, Separator, PageIntro } from '@/components/core';
import { useStore } from '@/hooks/useStore';
import { observer } from 'mobx-react-lite';
import { HeadTitle } from '@/components/core';


// tslint:disable-next-line: variable-name
export const NotFound: FC<Props> = observer(({}) => {

    const history = useHistory();
    const store = useStore();
    const prevLocation = store.history.prevLocation || '/cc';

    return <>
        <HeadTitle>Veea Control Center - 404</HeadTitle>
        <PageIntro title="Not found" icon="icon-102_Bug">
            <Link to={prevLocation} onClick={() => history.goBack()}>
                <i className="fas fa-chevron-left"></i>Go back
            </Link>
        </PageIntro>
        <Container solid>
            <NotFoundContent to={prevLocation} onClick={() => history.goBack()} />
        </Container>
    </>;
});
interface Props {}


// tslint:disable-next-line: variable-name
export const NotFoundBody: FC<Props> = observer(() => {
    const history = useHistory();
    const store = useStore();
    const prevLocation = store.history.prevLocation || '/cc';

    return <NotFoundContent to={prevLocation} onClick={() => history.goBack()} />;
});

// tslint:disable-next-line: variable-name
const NotFoundContent: FC<{ to: string, onClick(): void }> = ({ to, onClick }) => (
    <>
        <h1><b>Not found.</b></h1>
        The page you requested does not exist or is in progress. =)
        <Separator></Separator>
        <Link to={to} onClick={onClick}>Go back</Link>
    </>
);
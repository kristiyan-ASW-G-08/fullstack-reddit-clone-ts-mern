import React, { FC, useState, useEffect, Suspense, lazy } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Community from '@rddt/common/types/Community';
import Rule from '@rddt/common/types/Rule';
import Link from '@rddt/common/types/Link';
import axios, { AxiosResponse } from 'axios';
import Loader from 'components/Loader';
import styles from './CommunityPage.module.scss';
import PopulatedPost from '@rddt/common/types/PopulatedPost';

const CommunitySidebar = lazy(() =>
  import('./CommunitySidebar/CommunitySidebar'),
);
interface MatchParams {
  communityId: string;
}
interface PostLinks {
  create: Link;
  new: Link;
  top: Link;
  comments: Link;
}
const CommunityPage: FC<RouteComponentProps<MatchParams>> = ({ match }) => {
  const [community, setCommunity] = useState<Community>();
  const [rules, setRules] = useState<Rule[]>();
  const [posts, setPosts] = useState<PopulatedPost[]>();
  const { communityId } = match.params;
  const getRelated = async () => {
    await Promise.all<AxiosResponse[]>([
      axios.get(`http://localhost:8080/communities/${communityId}/rules`),
      axios.get(`http://localhost:8080/communities/${communityId}/posts`),
    ]).then(([rulesResponse, postsResponse]: any) => {
      setRules(rulesResponse.data.data.rules);
      setPosts(postsResponse.data.data.posts);
    });
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8080/communities/${communityId}`)
      .then(request => {
        setCommunity(request.data.data.community);
        const { links } = request.data;
        getRelated();
      })
      .catch(err => {
        console.log(err);
      });
  }, [communityId]);
  return (
    <>
      {community ? (
        <Suspense fallback={<Loader />}>
          <div className={styles.grid}>
            <aside className={styles.sidebar}>
              <CommunitySidebar community={community} />
              {rules ? '' : ''}
            </aside>{' '}
            <section className={styles.mainSection}>Some</section>
          </div>
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
};
export default withRouter(CommunityPage);

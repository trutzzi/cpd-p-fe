import { FC } from 'react';
import { Typography, Breadcrumbs } from '@material-ui/core';
import { FormattedMessage } from 'react-intl'
import Link, { LinkProps } from '@material-ui/core/Link';
import { Link as RouterLink } from "react-router-dom";
import { useIntl } from 'react-intl';

interface BreadcrumpProps {
  pathnames: any
}
interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}
const style = {
  marginTop: 10,
  marginBottom: 3
}

const Breadcrump: FC<BreadcrumpProps> = ({ pathnames }) => {
  const intl = useIntl()

  const LinkRouter = (props: LinkRouterProps) => <Link {...props} component={RouterLink as any} />;
  const homeTranslate = intl.formatMessage(
    {
      id: "home",
      defaultMessage: "Home"
    },
  );
  const signupTranslateText = intl.formatMessage(
    {
      id: "memberArea",
      defaultMessage: "Member area"
    }
  );
  const eventsTranslateText = intl.formatMessage(
    {
      id: "Events",
      defaultMessage: "Events"
    }
  );
  const breadcrumbNameMap: { [key: string]: string } = {
    '/': homeTranslate,
    '/signup': signupTranslateText,
    '/events': eventsTranslateText
  };

  return (
    <Breadcrumbs style={style} aria-label="breadcrumb">
      <LinkRouter color="inherit" to="/">
        <Typography color="textPrimary">
          <FormattedMessage
            id="home"
            defaultMessage="Home"
          />
        </Typography>
      </LinkRouter>
      {
        pathnames.map((value: any, index: any) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return last ? (
            <Typography color="textPrimary" key={to}>
              {breadcrumbNameMap[to]}
            </Typography>
          ) : (
            <LinkRouter color="inherit" to={to} key={to}>
              {breadcrumbNameMap[to]}
            </LinkRouter>
          );
        })
      }
    </Breadcrumbs>

  );
}
export default Breadcrump;
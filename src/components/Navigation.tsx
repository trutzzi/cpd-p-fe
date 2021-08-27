import { FC } from 'react';
import { NavLink } from "react-router-dom";
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import languages from '../languages'
import MenuItem from '@material-ui/core/MenuItem';
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl';


interface NavigationProps {
  username: string | null,
  toggleNav: React.Dispatch<React.SetStateAction<boolean>>
  onChangeLanguage: (e: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>) => void;
}

const Navigation: FC<NavigationProps> = ({ username, toggleNav, onChangeLanguage }) => {
  const intl = useIntl()

  return (
    <>
      <nav className="navigation">
        <div className="navigation-container">
          <ul>
            <li><NavLink onClick={() => toggleNav(false)} exact activeClassName='active' to="/">
              <FormattedMessage
                id="homeLink"
                defaultMessage="Home"
                description="Home link"
              />
            </NavLink ></li>
            <li><NavLink onClick={() => toggleNav(false)} exact activeClassName='active' to="/events">
              <FormattedMessage
                id="evenstLink"
                defaultMessage="Events"
                description="Events link"
              />
            </NavLink ></li>
            {!username && <li><NavLink onClick={() => toggleNav(false)} exact activeClassName='active' to="/signup">
              <FormattedMessage
                id="signupLink"
                defaultMessage="Signup"
                description="Signup link"
              />
            </NavLink ></li>}
          </ul>
          <FormLabel style={{ padding: '15px', display: 'block', color: '#fff', fontSize: ' 12px' }} htmlFor='language-set'>
            <FormattedMessage
              id="selectLang"
              defaultMessage="Select language"
              description="Select Language display text"
            />
          </FormLabel>
          <Select
            style={{ border: '1px solid #fff', color: '#fff', borderRadius: '5px', width: "170px", marginLeft: '10px', paddingLeft: '10px' }}
            labelId="language-set"
            defaultValue={'en-English'}
            onChange={onChangeLanguage}
          >
            {languages.map((item, key) => <MenuItem key={`lang-${key}`} value={`${item.value}-${item.name}`} > {item.name}</MenuItem>)}
          </Select>
        </div>
      </nav>
    </>
  )
}
export default Navigation;
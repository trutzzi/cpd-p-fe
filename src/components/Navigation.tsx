import { FC } from 'react';
import { NavLink } from "react-router-dom";
import Select from '@material-ui/core/Select';
import FormLabel from '@material-ui/core/FormLabel';
import languages from '../languages'
import MenuItem from '@material-ui/core/MenuItem';


type NavigationProps = {
  username: string | null,
  toggleNav: React.Dispatch<React.SetStateAction<boolean>>
  onChangeLanguage: (e: React.ChangeEvent<any>) => void;
}

const Navigation: FC<NavigationProps> = ({ username, toggleNav, onChangeLanguage }) => {
  return (
    <>
      <nav className="navigation">
        <div className="navigation-container">
          <ul>
            <li><NavLink onClick={() => toggleNav(false)} exact activeClassName='active' to="/">Home</NavLink ></li>
            {!username && <li><NavLink onClick={() => toggleNav(false)} exact activeClassName='active' to="/signup">Member Areea</NavLink ></li>}
          </ul>
          <FormLabel style={{ padding: '15px', display: 'block', color: '#fff', fontSize: ' 12px' }} htmlFor='language-set'>
            Set language
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
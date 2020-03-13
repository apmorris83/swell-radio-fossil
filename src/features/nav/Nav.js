import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useLocation, useHistory } from 'react-router-dom';

const menuItems = [
  { title: 'View', path: '/view', position: 'left' },
  { title: 'History', path: '/history', position: 'right' }
];

const Navbar = () => {
  const location = useLocation();
  const history = useHistory();
  const onNavigate = link => history.push(link);
  return (
    <Menu inverted fluid widths={2}>
      {menuItems.map(item => (
        <Menu.Item
          key={item.path}
          active={item.path === location.pathname}
          position={item.position}
          onClick={() => onNavigate(item.path)}
        >
          {item.title}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default Navbar;

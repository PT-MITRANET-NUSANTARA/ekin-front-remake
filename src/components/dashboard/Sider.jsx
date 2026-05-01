import { dashboardLink } from '@/data/link';
import { useAuth } from '@/hooks';
import { Drawer, Grid, Image, Menu, Tag } from 'antd';
import Sider from 'antd/es/layout/Sider';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DashboardSider = ({ collapsed, onCloseMenu }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const breakpoints = Grid.useBreakpoint();

  const isDesktop = breakpoints.lg || breakpoints.xl || breakpoints.xxl;

  console.log('User:', user, 'User roles:', user?.roles);

  // Filter menu items based on user roles
  const menuItems = dashboardLink
    .filter((item) => {
      if (!user) {
        console.log('No user, skipping');
        return false;
      }

      // Check if user has required role
      const userRoles = user?.roles ?? [];
      const itemRoles = item.roles ?? [];
      
      // If no roles are specified, show to everyone
      if (!itemRoles || itemRoles.length === 0) {
        console.log(`Item: ${item.label} has no role restrictions, showing`);
        return true;
      }
      
      // Check if any user role is in item roles
      const hasRole = userRoles.some(userRole => {
        return itemRoles.some(itemRole => {
          const userRoleStr = typeof userRole === 'string' ? userRole : userRole?.toString?.();
          const itemRoleStr = typeof itemRole === 'string' ? itemRole : itemRole?.toString?.();
          return userRoleStr === itemRoleStr;
        });
      });
      
      console.log(`Item: ${item.label}, itemRoles: [${itemRoles}], userRoles: [${userRoles}], hasRole: ${hasRole}`);
      
      if (!hasRole) return false;

      // For items with children
      if (item.children && item.children.length > 0) {
        const filteredChildren = item.children.filter((child) => {
          const childRoles = child.roles ?? itemRoles ?? [];
          
          if (!childRoles || childRoles.length === 0) return true;
          
          return userRoles.some(userRole => {
            return childRoles.some(childRole => {
              const userRoleStr = typeof userRole === 'string' ? userRole : userRole?.toString?.();
              const childRoleStr = typeof childRole === 'string' ? childRole : childRole?.toString?.();
              return userRoleStr === childRoleStr;
            });
          });
        });

        return filteredChildren.length > 0;
      }

      return true;
    })
    .map(({ label, children, icon: Icon, path, isMaintenance }) => ({
      key: path || label,
      label: (
        <div className="flex items-center justify-between gap-2">
          <span>{label}</span>
          {isMaintenance && <Tag color="orange">Maintenance</Tag>}
        </div>
      ),
      icon: Icon && <Icon />,
      children: children
        ?.filter((child) => {
          const childRoles = child.roles ?? [];
          const userRoles = user?.roles ?? [];
          
          if (!childRoles || childRoles.length === 0) return true;
          
          return userRoles.some(userRole => {
            return childRoles.some(childRole => {
              const userRoleStr = typeof userRole === 'string' ? userRole : userRole?.toString?.();
              const childRoleStr = typeof childRole === 'string' ? childRole : childRole?.toString?.();
              return userRoleStr === childRoleStr;
            });
          });
        })
        .map(({ path, label, isMaintenance: childMaintenance }) => ({
          key: path,
          label: (
            <div className="flex items-center justify-between gap-2">
              <span>{label}</span>
              {childMaintenance && <Tag color="orange">Maintenance</Tag>}
            </div>
          ),
          onClick: () => path && navigate(path)
        })),
      onClick: !children || children.length === 0 ? () => path && navigate(path) : undefined
    }));

  return isDesktop ? (
    <Sider theme="light" className="p-4" width={230} collapsed={collapsed}>
      <Link to="/">
        <div className="mb-4 flex w-full items-center justify-center">
          <Image src="/image_asset/ekin_logo.png" width={40} preview={false} />
        </div>
      </Link>
      <Menu className="w-full !border-none font-semibold" theme="light" mode="inline" defaultSelectedKeys={[pathname]} items={menuItems} />
    </Sider>
  ) : (
    <Drawer
      styles={{ body: { padding: 10 } }}
      placement="left"
      width={250}
      open={!collapsed}
      onClose={onCloseMenu}
      title={
        <Link to="/">
          <div className="flex w-full items-center justify-center"></div>
        </Link>
      }
    >
      <Menu className="w-full !border-none font-semibold" theme="light" mode="inline" defaultSelectedKeys={[pathname]} items={menuItems} />
    </Drawer>
  );
};

export default DashboardSider;

DashboardSider.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onCloseMenu: PropTypes.func.isRequired
};

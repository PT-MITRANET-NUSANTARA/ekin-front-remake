import { dashboardLink } from '@/data/link';
import { useAuth } from '@/hooks';
import { Drawer, Grid, Image, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DashboardSider = ({ collapsed, onCloseMenu }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const breakpoints = Grid.useBreakpoint();

  const isDesktop = breakpoints.lg || breakpoints.xl || breakpoints.xxl;

  // Tidak ada filter permission — semua item tampil
  const menuItems = dashboardLink
    .filter((item) => {
      if (!user) return false;

      // 🔥 cek parent
      const canAccessParent = user.canAccess({
        roles: item.roles,
        permissions: item.permissions
      });

      if (item.children && item.children.length > 0) {
        const filteredChildren = item.children.filter((child) => {
          return user.canAccess({
            roles: child.roles ?? item.roles,
            permissions: child.permissions ?? item.permissions
          });
        });

        return filteredChildren.length > 0;
      }

      return canAccessParent;
    })
    .map(({ label, children, icon: Icon, path }) => ({
      key: path || label,
      label: <span>{label}</span>,
      icon: Icon && <Icon />,
      children: children
        ?.filter((child) =>
          user?.canAccess({
            roles: child.roles,
            permissions: child.permissions
          })
        )
        .map(({ path, label }) => ({
          key: path,
          label: <span>{label}</span>,
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

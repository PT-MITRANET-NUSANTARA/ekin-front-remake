import { dashboardLink } from '@/data/link';
import { useAuth } from '@/hooks';
import { Drawer, Grid, Image, Menu, Tooltip } from 'antd';
import Sider from 'antd/es/layout/Sider';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DashboardSider = ({ collapsed, onCloseMenu }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const breakpoints = Grid.useBreakpoint();

  const isDesktop = breakpoints.lg || breakpoints.xl || breakpoints.xxl;

  const menuItems = dashboardLink
    .filter(({ permissions, roles }) => {
      if (!user) return false;

      const hasPermission = permissions && permissions.length > 0;
      const hasRole = roles && roles.length > 0;

      const isPublicPage = !hasPermission && !hasRole;
      if (isPublicPage) return true;

      const roleSpecific = hasRole && !hasPermission;
      if (roleSpecific) return user.eitherIs(...roles);

      const permissionSpecific = hasPermission && !hasRole;
      if (permissionSpecific) return user.eitherCan(...permissions);

      return user.eitherCan(...permissions) || user.eitherIs(...roles);
    })
    .map(({ label, children, icon: Icon }) => ({
      key: label,
      label: (
        <Tooltip title={label} placement="right" color="blue">
          <span>{label}</span>
        </Tooltip>
      ),
      icon: (
        <Tooltip title={label} placement="right" color="blue">
          <Icon />
        </Tooltip>
      ),
      children: children
        .filter(({ permissions, roles }) => {
          const hasPermission = !permissions || user?.eitherCan(...permissions);
          const hasRole = !roles || user?.eitherIs(...roles);
          return hasPermission && hasRole;
        })
        .map(({ path, label }) => ({
          key: path,
          label: (
            <Tooltip title={label} placement="right" color="blue">
              <span>{label}</span>
            </Tooltip>
          ),
          onClick: () => navigate(path)
        }))
    }));

  return isDesktop ? (
    <Sider theme="light" className="p-4" width={230} collapsed={collapsed}>
      <Link to="/">
        <div className="mb-4 flex w-full items-center justify-center">
          <Image width={40} preview={false} src={''} />
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
          <div className="flex w-full items-center justify-center">
            <Image width={40} preview={false} src={''} />
          </div>
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

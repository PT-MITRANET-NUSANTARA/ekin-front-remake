import { dashboardLink } from '@/data/link';
import { useAuth } from '@/hooks';
import { Drawer, Grid, Menu, Tooltip } from 'antd';
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
      // Jika ada children → cek permission anak
      if (item.children && item.children.length > 0) {
        return item.children.some((child) => {
          if (!child.permissions || child.permissions.length === 0) return true;
          return child.permissions.some((perm) => user?.permissions?.includes(perm));
        });
      }

      // Jika tidak ada children → cek permission parent
      if (item.permissions && item.permissions.length > 0) {
        return item.permissions.some((perm) => user?.permissions?.includes(perm));
      }

      // Tidak ada permission → tampilkan
      return true;
    })
    .map(({ label, children, icon: Icon, path }) => ({
      key: path || label,
      label: (
        <Tooltip title={label} placement="right" color="blue">
          <span>{label}</span>
        </Tooltip>
      ),
      icon: Icon && (
        <Tooltip title={label} placement="right" color="blue">
          <Icon />
        </Tooltip>
      ),
      children: children
        ?.filter((child) => {
          if (!child.permissions || child.permissions.length === 0) return true;
          return child.permissions.some((perm) => user?.permissions?.includes(perm));
        })
        .map(({ path, label }) => ({
          key: path,
          label: (
            <Tooltip title={label} placement="right" color="blue">
              <span>{label}</span>
            </Tooltip>
          ),
          onClick: () => path && navigate(path)
        })),
      onClick: !children || children.length === 0 ? () => path && navigate(path) : undefined
    }));

  return isDesktop ? (
    <Sider theme="light" className="p-4" width={230} collapsed={collapsed}>
      <Link to="/">
        <div className="mb-4 flex w-full items-center justify-center"></div>
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

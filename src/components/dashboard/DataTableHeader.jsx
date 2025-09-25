import { useAuth } from '@/hooks';
import { DeleteOutlined, DownloadOutlined, ExportOutlined, FilterOutlined, ImportOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Popover, Skeleton, Typography } from 'antd';
import PropTypes from 'prop-types';
import Crud from './Crud';
import { templateDownloader } from '@/utils/templateDownloader';

const { Title } = Typography;

// export default function DataHeader({ modul, selectedData, onStore, onDeleteBatch, model, children, onImport, onExport, onSearch, filter }) {
export default function DataHeader({ modul, selectedData, onStore, onDeleteBatch, children, onImport, onExport, onSearch, filter }) {
  const { user } = useAuth();
  const hasImportCapability = !!onImport && typeof onImport === 'object';

  const importMenuItems = hasImportCapability
    ? [
        {
          key: 'template',
          label: 'Download Template',
          onClick: () => templateDownloader(onImport.templateFile)
        },
        {
          key: 'import',
          label: 'Import Data',
          onClick: () => onImport.importHandler?.()
        }
      ]
    : [];

  const menuItems = [];

  // if (user?.can(CREATE, model) && onStore) {
  if (onStore) {
    menuItems.push({
      label: 'Tambah',
      key: 'create',
      icon: <PlusOutlined />
    });
  }
  // if (user?.can(DELETE, model) && onDeleteBatch) {
  if (onDeleteBatch) {
    menuItems.push({
      label: `Hapus ${selectedData?.length || 0} Pilihan`,
      key: 'deletebatch',
      icon: <DeleteOutlined />
    });
  }
  if (onImport) {
    menuItems.push(
      {
        label: 'Import Data',
        key: 'import',
        icon: <ImportOutlined />
      },
      {
        label: 'Download Template',
        key: 'template',
        icon: <DownloadOutlined />
      }
    );
  }
  if (onExport) {
    menuItems.push({
      label: 'Export Data',
      key: 'export',
      icon: <ExportOutlined />
    });
  }

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'create':
        onStore?.();
        break;
      case 'deletebatch':
        onDeleteBatch?.();
        break;
      case 'import':
        onImport?.importHandler?.();
        break;
      case 'template':
        templateDownloader?.(onImport.templateFile);
        break;
      case 'export':
        onExport?.();
        break;
      default:
        console.warn('Unhandled menu action:', key);
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between lg:mb-6">
        {modul ? (
          <Title level={5} style={{ margin: 0 }}>
            Data {modul}
          </Title>
        ) : (
          <Skeleton.Input size="small" />
        )}
        <Dropdown className="lg:hidden" menu={{ items: menuItems, onClick: handleMenuClick }}>
          <Button color="default" variant="link">
            <MenuOutlined />
          </Button>
        </Dropdown>
      </div>
      {/* {(children || (user && user.eitherCan([DELETE, model], [CREATE, model]))) && ( */}
      {children ||
        (user && (
          <div className="mb-6 flex flex-col-reverse justify-end gap-2 empty:hidden md:flex-row">
            {/* {user && user.can(DELETE, model) && onDeleteBatch && ( */}
            {onDeleteBatch && (
              <Button className="me-auto hidden lg:flex" icon={<DeleteOutlined />} variant="solid" color="danger" disabled={!selectedData?.length} onClick={onDeleteBatch}>
                Hapus {selectedData?.length || null} Pilihan
              </Button>
            )}
            <div className="mt-6 inline-flex items-center gap-x-2 lg:mt-0">
              {onSearch && <Input.Search style={{ margin: 0 }} onSearch={onSearch} className="mt-6 w-full lg:mt-0 lg:w-fit" placeholder="Cari Data" allowClear />}
              {filter && (
                <Popover placement="leftBottom" trigger="click" content={<Crud formFields={filter.formFields} initialData={filter.initialData} isLoading={filter.isLoading} onSubmit={filter.onSubmit} type="create" />}>
                  <Button icon={<FilterOutlined />} />
                </Popover>
              )}
            </div>
            {/* {user && user.can(CREATE, model) && onStore && ( */}
            {user && (
              <Button className="hidden lg:flex" icon={<PlusOutlined />} type="primary" onClick={onStore}>
                Tambah
              </Button>
            )}
            {onImport && (
              <div className="hidden lg:flex">
                <Dropdown.Button icon={<ImportOutlined />} menu={{ items: importMenuItems }}>
                  Import
                </Dropdown.Button>
              </div>
            )}
            {onExport && (
              <Button className="hidden lg:flex" variant="solid" icon={<ExportOutlined />} onClick={onExport}>
                Export
              </Button>
            )}

            {children}
          </div>
        ))}
    </>
  );
}

DataHeader.propTypes = {
  modul: PropTypes.string,
  onVerify: PropTypes.func,
  onStore: PropTypes.func,
  onImport: PropTypes.object,
  onExport: PropTypes.func,
  onSearch: PropTypes.func,
  filter: PropTypes.object,
  onDeleteBatch: PropTypes.func,
  selectedData: PropTypes.array,
  model: PropTypes.func,
  children: PropTypes.node
};

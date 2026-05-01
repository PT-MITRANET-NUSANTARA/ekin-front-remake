import { Card, Typography, Breadcrumb, Space } from 'antd';
import PropTypes from 'prop-types';

const PageExplanation = ({ title, subTitle, pageSummaryData, breadcrumb, actions }) => {
  return (
    <>
      <Card
        className="mb-4 w-full"
        style={{
          backgroundImage: "url('/image_asset/page_explanation.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-3" />}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-y-2">
            <Typography.Title style={{ color: '#fff', margin: 0 }} level={3}>
              {title}
            </Typography.Title>
            <small className="max-w-sm text-white">{subTitle}</small>
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
        {pageSummaryData && (
          <>
            <div className="mt-4 flex items-center gap-4">
              {pageSummaryData.map((item) => (
                <Card key={item.key} className="w-full">
                  <div className="flex w-full flex-col gap-y-2">
                    <small className="text-gray-500">{item?.label}</small>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {item?.value}
                    </Typography.Title>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>
    </>
  );
};

PageExplanation.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  pageSummaryData: PropTypes.array,
  breadcrumb: PropTypes.array,
  actions: PropTypes.node
};

export default PageExplanation;

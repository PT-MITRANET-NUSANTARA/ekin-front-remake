import { Card, Skeleton } from 'antd';
import PropTypes from 'prop-types';

export default function DataLoader({ type }) {
  switch (type) {
    case 'avatar':
      return <Skeleton.Avatar active />;
    case 'datatable':
      return (
        <Card>
          <div className="flex flex-col">
            <div className="mb-12 flex items-center justify-between">
              <Skeleton.Button size="small" active />
              <div>
                <Skeleton.Button active />
              </div>
            </div>
            <div className="overflow-x-auto">
              <Skeleton active />
            </div>
          </div>
        </Card>
      );
    case 'profil':
      return (
        <>
          <div className="col-span-4 flex w-full flex-col gap-y-4">
            <Card className="w-full">
              <Skeleton active />
            </Card>
          </div>
          <div className="col-span-8">
            <Card className="w-full" title={<Skeleton.Input active />}>
              <div className="flex flex-col gap-y-4">
                <Skeleton.Input active />
                <Skeleton.Input active />
                <Skeleton.Input active />
                <Skeleton.Input active />
              </div>
            </Card>
          </div>
        </>
      );
  }
}

DataLoader.propTypes = {
  type: PropTypes.string
};

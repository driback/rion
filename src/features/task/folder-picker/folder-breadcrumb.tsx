import { Fragment } from 'react';
import List from '~/components/list';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

type TBreadcrumbItem = {
  id: string;
  label: string;
};

type BreadcrumbsProps = {
  breadCrumbs: TBreadcrumbItem[];
  onNavigate: (props?: TBreadcrumbItem) => void;
};

const FolderBreadcrumbs = ({ breadCrumbs, onNavigate }: BreadcrumbsProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <button
              type="button"
              onClick={() => onNavigate()}
              aria-label="Navigate to root"
              className="hover:underline"
            >
              {breadCrumbs[0].label}
            </button>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <List of={breadCrumbs.slice(1)}>
          {(data, index) => (
            <Fragment key={data.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index + 2 !== breadCrumbs.length ? (
                  <BreadcrumbLink asChild>
                    <button
                      type="button"
                      onClick={() => onNavigate(data)}
                      aria-label={`Navigate to ${data.label}`}
                      className="hover:underline"
                    >
                      {data.label}
                    </button>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{data.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          )}
        </List>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default FolderBreadcrumbs;

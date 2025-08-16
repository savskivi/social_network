import { Card } from "@heroui/card";
import { User } from "@heroui/user";
import PlusIcon from "../assets/icons/PlusIcon";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import type { User as UserT } from "../types";
import { Select, SelectItem, Skeleton } from "@heroui/react";
import downward from "../assets/downward.svg";
import upward from "../assets/upward.svg";
import { Link } from "react-router";

function UserSkeleton() {
  return (
    <div className="w-full flex items-center justify-center gap-2">
      <div>
        <Skeleton className="flex rounded-full w-10 h-10" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20 rounded-lg" />
        <Skeleton className="h-4 w-20 rounded-lg" />
      </div>
    </div>
  );
}

type Props = {
  currentUser: UserT | null;
  onFilterOpen: () => void;
  filterTagsSelected: string[];
  setFilterTagsSelected: (tags: string[]) => void;
  sort: string;
  setSort: (sort: string) => void;
  limit: string;
  setLimit: (limit: string) => void;
};

export default function Sidebar({
  currentUser,
  onFilterOpen,
  filterTagsSelected,
  setFilterTagsSelected,
  sort,
  setSort,
  limit,
  setLimit,
}: Props) {
  const handleClose = (tagToRemove: string) => {
    setFilterTagsSelected(
      filterTagsSelected.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <div className="mt-4 flex flex-col gap-4 w-[25%]">
      <Card className="p-4 w-full">
        {currentUser ? (
          <Link to={`/profile/${currentUser.id}`}>
            <User
              avatarProps={{
                src: currentUser.url,
              }}
              description={
                <p>
                  @{currentUser.username}
                </p>
              }
              name={currentUser.fullName}
            />
          </Link>
        ) : (
          <UserSkeleton />
        )}
      </Card>

      <Card className="p-4 w-full flex flex-col gap-2">
        <Select
          selectedKeys={[sort]}
          onChange={(e) => setSort(e.target.value)}
          className="max-w-xs"
          label="Sort by"
        >
          <SelectItem key="id">Default</SelectItem>
          <SelectItem key="title" startContent={<img src={upward} />}>
            Title
          </SelectItem>
          <SelectItem key="-title" startContent={<img src={downward} />}>
            Title
          </SelectItem>
          <SelectItem key="likes" startContent={<img src={upward} />}>
            Likes
          </SelectItem>
          <SelectItem key="-likes" startContent={<img src={downward} />}>
            Likes
          </SelectItem>

          <SelectItem key="date" startContent={<img src={upward} />}>
            Date
          </SelectItem>

          <SelectItem key="-date" startContent={<img src={downward} />}>
            Date
          </SelectItem>
        </Select>

        <Select
          selectedKeys={[limit]}
          onChange={(e) => setLimit(e.target.value)}
          className="max-w-xs"
          label="Show per page"
        >
          <SelectItem key="5">5</SelectItem>

          <SelectItem key="10">10</SelectItem>

          <SelectItem key="15">15</SelectItem>

          <SelectItem key="20">20</SelectItem>
        </Select>
      </Card>

      <Card className="p-4 w-full">
        <div className="flex justify-between items-center pb-4">
          <p className="text-sm">FOLLOWED HASHTAGS</p>

          <PlusIcon onClick={onFilterOpen} />
        </div>
        <Divider />

        <div className="flex flex-wrap gap-2 mt-4">
          {filterTagsSelected.map((tag, index) => (
            <Chip key={index} variant="flat" onClose={() => handleClose(tag)}>
              {tag}
            </Chip>
          ))}
        </div>
      </Card>
    </div>
  );
}

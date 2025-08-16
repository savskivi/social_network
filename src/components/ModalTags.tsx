import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { CheckboxGroup } from "@heroui/react";
import { CustomCheckbox } from "./CustomCheckbox";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
  setGroupSelected: (data: string[]) => void;
  groupSelected: string[];
  isRestricted?: boolean;
};
const tags = [
  "fun",
  "lifehack",
  "lifestory",
  "food",
  "sport",
  "gaming",
  "shopping",
  "study",
  "art",
  "music",
  "fashion",
  "movie",
  "celebrity",
  "meditation",
  "recipe",
  "politics",
  "breakingNews",
  "chill",
  "cozy",
  "party",
  "AI",
  "cryptocurrency",
  "money",
  "stream",
];

export default function ModalTags({
  isOpen,
  onOpenChange,
  setGroupSelected,
  groupSelected,
  isRestricted = true,
}: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center">
              {isRestricted
                ? "Add up to 5 #hashtags to your post"
                : "Choose hashtags to filter posts"}
            </ModalHeader>

            <ModalBody>
              <CheckboxGroup
                className="gap-1"
                label="Select amenities"
                orientation="horizontal"
                value={groupSelected}
                onChange={(value) => setGroupSelected(value)}
              >
                {tags.map((tag) => (
                  <CustomCheckbox
                    key={tag}
                    className={isRestricted &&
                      groupSelected.length >= 5 &&
                      !groupSelected.includes(tag) &&
                      "pointer-events-none" || ''
                    }
                    value={tag}
                  >
                    #{tag}
                  </CustomCheckbox>
                ))}
              </CheckboxGroup>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Apply
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

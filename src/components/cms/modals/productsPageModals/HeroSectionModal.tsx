import { useEffect, useState } from "react";
import { message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";

import HeroSectionFields from "../../sections/homePageSections/HeroSectionFields";
import type { FormValues } from "../../sections/sharedSectionFields/types";
import { useUploadProductsPageHeroBannerImagesMutation } from "@/redux/features/generalApi/cmsSectionsApi";
import CmsSectionEditorModal from "../sectionModalShared/CmsSectionEditorModal";
import renderButtonFields from "../sectionModalShared/buttonFields";
import { getSectionDescription } from "../sectionModalShared/sectionDescriptions";
import {
  getHeroBannerImageUrls,
  trimField,
  trimList,
} from "../sectionModalShared/sectionFormValues";
import type { SectionModalProps } from "../sectionModalShared/types";

const buildBaseHeroContent = (values: FormValues) => ({
  primaryButtonText: trimField(values.primaryButtonText),
  primaryButtonLink: trimField(values.primaryButtonLink),
  secondaryButtonText: trimField(values.secondaryButtonText),
  secondaryButtonLink: trimField(values.secondaryButtonLink),
  bannerImageUrls: trimList(values.bannerImageUrls),
  highlights: trimList(values.highlights),
  promoCardTitle: trimField(values.promoCardTitle),
  promoCardSubtitle: trimField(values.promoCardSubtitle),
  promoCardItems: trimList(values.promoCardItems),
  deliveryTitle: trimField(values.deliveryTitle),
  deliverySubtitle: trimField(values.deliverySubtitle),
  trustedTitle: trimField(values.trustedTitle),
  trustedSubtitle: trimField(values.trustedSubtitle),
});

const HeroSectionModal = (props: SectionModalProps) => {
  const [bannerFileList, setBannerFileList] = useState<UploadFile[]>([]);
  const [uploadProductsPageHeroBannerImages, { isLoading: isUploadingBanners }] =
    useUploadProductsPageHeroBannerImagesMutation();

  useEffect(() => {
    setBannerFileList([]);
  }, [props.open, props.section]);

  const buildHeroContent = async (values: FormValues) => {
    if (!props.section) {
      return null;
    }

    const existingHeroBannerImageUrls = getHeroBannerImageUrls(props.section);
    let heroBannerImageUrls =
      values.bannerImageUrls?.map((item) => item.trim()).filter(Boolean) ||
      existingHeroBannerImageUrls;

    if (bannerFileList.length > 0) {
      try {
        const payload = new FormData();

        bannerFileList.forEach((file) => {
          if (file.originFileObj) {
            payload.append("banners", file.originFileObj);
          }
        });

        const response = await uploadProductsPageHeroBannerImages(payload).unwrap();
        heroBannerImageUrls = [
          ...heroBannerImageUrls,
          ...response.data.bannerImageUrls,
        ];
      } catch {
        message.error("Products page banner images could not be uploaded.");
        return null;
      }
    }

    return {
      ...buildBaseHeroContent(values),
      bannerImageUrls: heroBannerImageUrls,
    };
  };

  return (
    <CmsSectionEditorModal
      {...props}
      description={getSectionDescription(props.section)}
      submitLoading={isUploadingBanners}
      buildContent={buildHeroContent}
    >
      {(form) => (
        <HeroSectionFields
          form={form}
          bannerFileList={bannerFileList}
          isUploadingBanners={isUploadingBanners}
          onBannerFileListChange={setBannerFileList}
          renderButtonFields={renderButtonFields}
        />
      )}
    </CmsSectionEditorModal>
  );
};

export default HeroSectionModal;

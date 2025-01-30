import Image from "next/image";
import React from "react";

const PhotoGallery = ({ projectData }) => {
  const photos = projectData.images;

  return (
    <div class="mx-auto grid max-w-[85%] grid-cols-1 place-items-center gap-2 border md:grid-cols-2">
      {photos.map((photo, i) => {
        return (
          <div key={i}>
            <Image
              class="h-auto max-w-full rounded-lg"
              src={photo}
              alt=""
              width={700}
              height={500}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PhotoGallery;

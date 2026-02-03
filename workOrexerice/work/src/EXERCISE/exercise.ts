/* eslint-disable */

import { transform } from "typescript";

const formdata = {
  actionMedia: [] as Array<{
    url: string;
    storage: string;
    type: "video" | "image";
  }>,
  muscleGroup: [] as number[],
};

const actionMediaUrls = row.actionMedia || [];
const actionMediaStorageUrls = row._actionMedia || [];

if (Array.isArray(actionMediaUrls) && actionMediaUrls.length > 0) {
  formdata.actionMedia = actionMediaUrls.map((url: string, index: number) => ({
    url: url,
    storage: actionMediaStorageUrls[index],
    type: getTypeByUrl(url),
  }));
} else {
  formdata.actionMedia = [];
}

const getTypeByUrl = (url: string): "video" | "image" => {
  if (!url) return "image";

  const urlLower = url.toLowerCase();
  if (urlLower.includes("mp4") || urlLower.includes("video")) {
    return "video";
  }

  return "image";
};

const getType = (file: File): "video" | "image" => {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".jpg")) {
    return "image";
  } else if (fileName.endsWith(".mp4")) {
    return "video";
  }

  return "image";
};

const partMuscleMap = ref<Map<number, number[]>>(new Map<number, number[]>());
const previousPart = ref<number[]>([]);
const handlePartChange = (newPart: number[]) => {
  const removeParts = previousPart.value.filter((id) => !newPart.includes(id));

  if (removeParts.length > 0) {
    const removePartsIds = new Set<number>();
    for (const partId of removeParts) {
      const muscleIds = partMuscleMap.value.get(partId);
      if (muscleIds) {
        muscleIds.forEach((id) => removePartsIds.add(id));
      }
    }

    formdata.muscleGroup = formdata.muscleGroup.filter(
      (id) => !removePartsIds.has(id),
    );
  }

  if (newPart && newPart.length > 0) {
    const addParts = newPart.filter((id) => !previousPart.value.includes(id));

    if (addParts.length > 0) {
      const addPartsIds = new Set<number>();
      for (const partId of addParts) {
        const muscleIds = partMuscleMap.value.get(partId);
        if (muscleIds) {
          muscleIds.forEach((id) => addPartsIds.add(id));
        }
      }

      addPartsIds.forEach((id) => {
        if (!formdata.muscleGroup.includes(id)) {
          formdata.muscleGroup.push(id);
        }
      });
    }
  }
};

interface ListItem {
  name: string;
}

transform: {
  dataTransformer: (records) => {
    if (Array.isArray(!records)) {
      console.log("error", typeof records);
      return [];
    }

    type haveIndexList = ListItem & {
      _rowIndex: number;
    };

    const processRecords: haveIndexList = records.map(
      (item: Object, index: number) => ({
        ...item,
        _rowIndex: index,
      }),
    );

    return processRecords;
  };
}

let pagenation = 1;
let pageSize = 1;

const getIndexText = (row: any) => {
  if (row._rowIndex !== undefined) {
    const pageOffset = (pagenation - 1) * pageSize;
    const displayIndex = pageOffset + (row._rowIndex + 1);
    return `{displayIndex}`;
  }

  return `${row.id}`;
};

paramsSerializer: {
  serialize: (params: any) => {
    const parts: string[] = [];
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value === undefined || value === null || value === "") {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
        });
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    });
    return parts.join("&");
  };
}

interface Prop {
  visible: boolean
  admin: boolean
}
const prop = defineProps<Prop>()

interface Emit {
  'update: visible': [visible: boolean],
  'submit':[data: any]
}
const emits = defineEmits<Emit>()
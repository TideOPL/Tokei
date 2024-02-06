import { FaCross, FaPencil, FaX } from "react-icons/fa6";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { ICategory } from "~/interface/Category";
import { env } from "~/env.mjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { setStreamInfo } from "~/store/slice/streamInfoSlice";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  getToken: () => Promise<string | null>;
}

const EditStream = ({ setActive, getToken }: Props) => {
  const dispatch = useAppDispatch();
  const streamInfo = useAppSelector((state) => state.streamInfo);
  const [result, setResult] = useState<ICategory[]>([]);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const run = async () => {
      setTags([]);
      const _tags: string[] = [];
      streamInfo.streamInfo?.tags.map((tag) => _tags.push(tag));
      setTags(_tags);
      setTitle(streamInfo.streamInfo?.title || "");

      if (streamInfo.streamInfo?.category) {
        const { data } = await axios.get<ICategory[]>(
          `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/categories/searchCategory?search=${streamInfo.streamInfo.category}`,
        );
        console.log(data);

        if (data[0]) {
          setCategory(data[0]);
        }
      }
    };
    run();
  }, [streamInfo]);

  const search = async (query: string) => {
    if (query.length < 2) {
      setResult([]);
      return;
    }

    const { data } = await axios.get<ICategory[]>(
      `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/categories/searchCategory?search=${query}`,
    );
    setResult(data);
  };

  const setCurrentCategory = (category: ICategory) => {
    setCategory(category);
  };

  const update = async () => {
    const token = await getToken();
    const status = await axios
      .post(
        `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/updateStreamInfo`,
        { title: title, tags: tags, category: category?.name },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => true)
      .catch(() => false);

    if (status) {
      dispatch(
        setStreamInfo({
          title: title,
          category: category?.name || "Unkown Category",
          tags: tags,
        }),
      );
    }
  };

  return (
    <Dialog onOpenChange={(open) => setActive(open)}>
      <DialogTrigger asChild>
        <Button variant={"link"} className="group mx-3 mt-2">
          <FaPencil className="flex h-5 w-5 rotate-[5deg] fill-zinc-400 transition-all group-hover:rotate-[-25deg] group-hover:fill-white" />
        </Button>
      </DialogTrigger>
      <DialogContent style={{ backgroundColor: "#141516", border: "none" }}>
        <DialogHeader>
          <div className="font-noto-sans text-3xl font-bold text-white">
            Edit Stream
          </div>
        </DialogHeader>
        <DialogDescription>
          <div className="grid w-full space-y-3">
            <div className="gap-1.5">
              <Label htmlFor="title" className="font-semibold">
                Title
              </Label>
              <Textarea
                placeholder="Enter Stream Title"
                id="title"
                onChange={(event) => setTitle(event.currentTarget.value)}
                value={title}
              />
            </div>
            <div>
              <Label htmlFor="tags" className="font-semibold">
                Tags
              </Label>
              <div className="relative">
                <form
                  onSubmit={(value) => {
                    value.preventDefault();
                    if (
                      newTag.length < 3 ||
                      tags.length > 10 ||
                      tags.includes(newTag)
                    ) {
                      return;
                    }
                    setTags([...tags, newTag]);
                    setNewTag("");
                  }}
                >
                  <Input
                    id="tags"
                    className="pl-8"
                    placeholder="Enter a Tag"
                    autoComplete="off"
                    value={newTag}
                    onChange={(event) => setNewTag(event.currentTarget.value)}
                  />
                </form>
                <div className="absolute left-3 top-3">
                  <FaSearch />
                </div>
              </div>
              <div className="flex flex-row flex-wrap gap-x-2 gap-y-2 pt-2">
                {tags.map((tag) => (
                  <Badge
                    key={"tag"}
                    variant="secondary"
                    className="w-fit gap-x-2 rounded-xl"
                  >
                    <div>{tag}</div>
                    <div>
                      <Button
                        className="h-2 w-2 p-0"
                        onClick={() => {
                          const index = tags.indexOf(tag);
                          const array = tags;
                          array.splice(index, 1);
                          setTags([...array]);
                        }}
                        variant={"link"}
                      >
                        <FaX className="h-2 w-2" />
                      </Button>
                    </div>
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="category" className="font-semibold">
                Category
              </Label>
              {category == null ? (
                <>
                  <div className="relative" id="category">
                    <Input
                      className="pl-8"
                      placeholder="Enter a Category"
                      onChange={async (event) => {
                        search(event.currentTarget.value);
                      }}
                    />
                    <div className="absolute left-3 top-3">
                      <FaSearch />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute">
                      {result.length > 0 && (
                        <div className="max-h-56 rounded-lg bg-[#1f2023] px-2 py-2">
                          <div className="max-h-52 space-y-2 overflow-y-scroll">
                            {result.map((res) => (
                              <Button
                                key={res.name}
                                variant={"ghost"}
                                className="flex h-fit w-96 flex-row items-start justify-start space-x-2"
                                onClick={() => setCurrentCategory(res)}
                              >
                                <div>
                                  <Image
                                    src={res.image}
                                    alt={res.name}
                                    width={32}
                                    height={64}
                                    className="rounded-sm"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <div className="... w-80 truncate text-left font-bold text-white">
                                    {res.name}
                                  </div>
                                  <div className="text-left">
                                    {res.developer?.split(",")[0]}
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-row justify-between rounded-lg bg-[#1f2023] px-2 py-1">
                  <div className="flex flex-row gap-x-4">
                    <div>
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={32}
                        height={64}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="... w-80 truncate text-left font-bold text-white">
                        {category.name}
                      </div>
                      <div className="text-left">
                        {category.developer?.split(",")[0]}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant={"link"}
                    className="self-center"
                    onClick={() => setCategory(null)}
                  >
                    <FaX />
                  </Button>
                </div>
              )}
            </div>
            <DialogClose className="flex flex-row-reverse gap-x-2" asChild>
              <div>
                <Button
                  variant={"default"}
                  className="bg-primary_lighter font-bold hover:bg-primary_lighter/5 dark:bg-primary dark:hover:bg-primary/90"
                  onClick={async () => await update()}
                >
                  Done
                </Button>
                <Button variant={"ghost"}>Close</Button>
              </div>
            </DialogClose>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default EditStream;

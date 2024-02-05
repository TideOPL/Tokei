import { FaPencil } from "react-icons/fa6";
import { Button } from "../ui/button";
import {
  Dialog,
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
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";

const EditStream = () => {
  const [result, setResult] = useState<ICategory[]>([]);
  const search = async (query: string) => {
    const { data } = await axios.get<ICategory[]>(
      `http://${env.NEXT_PUBLIC_URL}:${env.NEXT_PUBLIC_EXPRESS_PORT}/api/v1/categories/searchCategory?search=${query}`,
    );
    setResult(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="group mx-3 mt-2">
          <FaPencil className="flex h-5 w-5 fill-zinc-400 transition-colors group-hover:fill-white" />
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
              <Textarea placeholder="Enter Stream Title" id="title" />
            </div>
            <div>
              <Label htmlFor="tags" className="font-semibold">
                Tags
              </Label>
              <div className="relative">
                <Input id="tags" className="pl-8" placeholder="Enter a Tag" />
                <div className="absolute left-3 top-3">
                  <FaSearch />
                </div>
              </div>
              <div className="flex flex-row flex-wrap gap-x-2 gap-y-2 pt-2">
                <Badge
                  key={"tag"}
                  variant="secondary"
                  className="w-fit rounded-xl"
                >
                  English
                </Badge>
              </div>
            </div>
            <div>
              <Label htmlFor="category" className="font-semibold">
                Category
              </Label>
              <div className="relative">
                <Input
                  id="category"
                  className="pl-8"
                  placeholder="Enter a Category"
                  onChange={async (event) => search(event.currentTarget.value)}
                />
                <div className="absolute left-3 top-3">
                  <FaSearch />
                </div>
              </div>
              <div className="">
                <DropdownMenu open>
                  <DropdownMenuTrigger className="hidden">
                    {" "}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="absolute left-[38rem] top-[49rem] z-[9999] max-h-32 overflow-y-scroll ">
                    {result.map((res) => (
                      <DropdownMenuItem>{res.name}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default EditStream;

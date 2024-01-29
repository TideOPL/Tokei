import BrowseListItem from "~/component/browse/BrowseListItem";
import useBrowse from "~/hook/useBrowse";
import { Browse } from "~/interface/Channel";


// TODO: https://steamcdn-a.akamaihd.net/steam/apps/271590/library_600x900_2x.jpg
const Browse = (): JSX.Element => {
    const { items } = useBrowse();
    return (
        <div className="md: grid h-full w-full justify-center gap-3 pb-5 sm:grid-cols-1 sm:px-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:px-15 2xl:grid-cols-7">
            {items.map((channel: Browse) => (
                <BrowseListItem title={channel.stream.streamTitle} username={channel.channel.username} pfp={channel.channel.pfp} thumbnail="/live_user_ibai-440x248.jpg"/>
            ))}
        </div>
    )
} 

export default Browse;
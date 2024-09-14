import React, { useEffect, useState } from "react"
import browser from "webextension-polyfill"

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([])
  console.log(bookmarks)

  useEffect(() => {
    // Fetch existing bookmarks
    const fetchBookmarks = async () => {
      try {
        const bookmarkTree = await browser.bookmarks.getTree()
        setBookmarks(bookmarkTree)
      } catch (error) {
        console.error("Error fetching bookmarks:", error)
      }
    }

    fetchBookmarks()
  }, [])

  // Function to create a new bookmark tree
  const createBookmarkTree = async () => {
    try {
      // Create a new folder
      const newFolder = await browser.bookmarks.create({
        title: "My New Folder"
      })

      // Add bookmarks under the newly created folder
      await browser.bookmarks.create({
        parentId: newFolder.id,
        title: "Example Bookmark 1",
        url: "https://example.com"
      })

      await browser.bookmarks.create({
        parentId: newFolder.id,
        title: "Example Bookmark 2",
        url: "https://example2.com"
      })

      // Refresh bookmarks after creation
      const bookmarkTree = await browser.bookmarks.getTree()
      setBookmarks(bookmarkTree)
    } catch (error) {
      console.error("Error creating bookmarks:", error)
    }
  }

  // Render bookmarks
  const renderBookmarks = (bookmarkNodes: any) => {
    return bookmarkNodes.map((bookmark: any) => (
      <li key={bookmark.id}>
        {bookmark.url ? (
          <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
            {bookmark.title}
          </a>
        ) : (
          <strong>{bookmark.title} (Folder)</strong>
        )}
        {bookmark.children && <ul>{renderBookmarks(bookmark.children)}</ul>}
      </li>
    ))
  }

  return (
    <div>
      <h2>User Bookmarks</h2>
      <button onClick={createBookmarkTree}>Create Bookmark Tree</button>
      <ul>{renderBookmarks(bookmarks)}</ul>
    </div>
  )
}

export default Bookmarks

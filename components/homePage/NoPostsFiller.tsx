function NoPostsFiller() {
  return (
    <div>
      <picture>
        <img
          className="h-4 w-4 opacity-0"
          src="/instagramLoading.png"
          alt="avatar"
        />
      </picture>
      <p className="animate-pulse rounded-lg border border-stone-300 bg-white px-2 py-4 dark:border-stone-700 dark:bg-[#1c1c1c]">
        Suivez des utilisateurs pour voir leurs dernières publications et stories.
      </p>
    </div>
  );
}

export default NoPostsFiller;

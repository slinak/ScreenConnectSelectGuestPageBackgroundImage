<%@ WebHandler Language="C#" Class="SelectGuestBackgroundImageService" %>

using System;
using System.Web;
using System.Linq;
using System.Collections.Generic;
using System.Security.Principal;
using System.Threading.Tasks;
using ScreenConnect;

[DemandPermission(PermissionInfo.AdministerPermission)]
public class SelectGuestBackgroundImageService : WebServiceBase
{
	public List<string> GetPossibleBackgroundImages()
	{
		List<string> images = new List<string>();
		
		for (int i = 0; i < 7; i++)
			images.Add(ExtensionContext.Current.GetSettingValue("Image" + i));
			
		return images;
	}
	
	public async Task SetGuestPageBackground(string selectedImage)
	{
		await ExtensionRuntime.SetExtensionSettingAsync(ExtensionContext.Current.ExtensionID, "SelectedBackgroundImage", selectedImage);
	}
}

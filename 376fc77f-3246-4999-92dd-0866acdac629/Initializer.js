SC.event.addGlobalHandler(SC.event.QueryPanels, function (eventArgs) {
	if (SC.context.pageType === 'GuestPage')
		if (!SC.util.isNullOrEmpty(extensionContext.settingValues.SelectedBackgroundImage))
			$('.ContentPanel').style = SC.util.formatString("background-image:url({0}/Images/{1});", extensionContext.baseUrl, extensionContext.settingValues.SelectedBackgroundImage);
		else
			$('.ContentPanel').style = SC.util.formatString("background:{0}", "linear-gradient(to bottom, #00202E, #1CB8B8)");
});

SC.event.addGlobalHandler(SC.event.QueryCommandButtons, function (eventArgs) {
	switch (eventArgs.area) {
		case 'ExtrasPopoutPanel':
			eventArgs.buttonDefinitions.push({ commandName: 'ShowGuestPageBackgroundImageModal', text: SC.res['GuestPageBackgroundSelector.ExtrasPopoutPanel.OpenConfigurationModal'] });
			break;
	}
});

SC.event.addGlobalHandler(SC.event.QueryCommandButtonState, function(eventArgs){
	switch(eventArgs.commandName) {
		case 'ShowGuestPageBackgroundImageModal':
			if ((SC.context.pageType == 'AdministrationPage' || SC.context.pageType == 'HostPage') && SC.context.isUserAdministrator) {
				SC.util.includeStyleSheet(extensionContext.baseUrl + 'GuestBackgroundSelector.css');
				eventArgs.isEnabled = eventArgs.isVisible = true;
			}
			else
				eventArgs.isEnabled = eventArgs.isVisible = false;
			break;
	}
});

SC.event.addGlobalHandler(SC.event.ExecuteCommand, function(eventArgs) {
	switch(eventArgs.commandName) {
		case 'ShowGuestPageBackgroundImageModal':
			SC.service.GetPossibleBackgroundImages(function(images) {
				SC.dialog.showModalButtonDialog(
					'ConfigureGuestPageBackground',
					SC.res['GuestPageBackgroundSelector.Modal.Title'],
					SC.res['GuestPageBackgroundSelector.Modal.SaveButtonText'],
					'Default',
					function(container) {
						SC.ui.addContent(container, [
							$table({className: 'BackgroundImageTable'},
								$thead([
									$th({innerText: SC.res['GuestPageBackgroundSelector.Modal.ImageTableHeaderText']}),
									$th({innerText: SC.res['GuestPageBackgroundSelector.Modal.ImageTableHeaderPreviewText']}),
									$th({innerText: SC.res['GuestPageBackgroundSelector.Modal.ImageTableHeaderSelectionText']}),
								]),
								$tbody([
									$tr({ style: 'text-align:center;' }, [
										$td({ style: 'background:linear-gradient(to bottom, #00202E, #1CB8B8); width:400px; height:225px;' }),
										$td(),
										$td($input({ type: 'radio', name: 'backgroundImages', value: '', checked: SC.util.isNullOrEmpty(extensionContext.settingValues.SelectedBackgroundImage) ? true : false }))
									]),
									images.map(function(_) {
										return $tr({ style: 'text-align:center;' }, [
											$td($img({ width: '400', height: '225', src: SC.util.formatString("{0}Images/{1}", extensionContext.baseUrl, _) })),
											$td($a({ href: SC.util.formatString("{0}Images/{1}", extensionContext.baseUrl, _), target: '_blank', innerText: SC.res['GuestPageBackgroundSelector.Modal.ImageTablePreviewText'] })),
											$td($input({ type: 'radio', name: 'backgroundImages', value: _, checked: extensionContext.settingValues.SelectedBackgroundImage == _ ? true : false }))
										]);
									})
								])
							)
						]);
					},
					function (eventArgs) {
						switch (eventArgs.commandName) {
							case 'Default':
								var selection = document.querySelector('input[name="backgroundImages"]:checked').value;
								SC.service.SetGuestPageBackground(selection, function() {
									SC.dialog.hideModalDialog();
								});
								break;
						}
					}
				);
			});
			break;
	}
});